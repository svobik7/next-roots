/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

// Cypress E2E Test
describe('Home', () => {
  const BASE_URL = 'http://localhost:3000'

  const languages = [
    {
      code: 'cs',
      name: 'Čeština',
      links: [
        'Domů',
        'Produkty',
        'Knihy',
        'O Nás',
        'Kontakty',
        'Jak najít svůj první zlatý poklad?',
      ],
    },
    {
      code: '',
      name: 'English',
      links: [
        'Home',
        'Products',
        'Books',
        'About',
        'Contacts',
        'How to find your first gold treasure?',
      ],
    },
    {
      code: 'es',
      name: 'Español',
      links: [
        'Hogar',
        'Productos',
        'Libros',
        'Sobre',
        'Contactos',
        '¿Cómo encontrar tu primer tesoro de oro?',
      ],
    },
  ]

  const authors = {
    joeBlack: {
      name: 'Joe Black',
      slug: '/blogs/joe-black',
      translations: [
        {
          slug: '/cs/blogy/joe-black',
        },
        {
          slug: '/es/blogs/joe-black',
        },
      ],
    },
    markBrown: {
      name: 'Mark Brown',
      slug: '/blogs/mark-brown',
      translations: [
        {
          slug: '/cs/blogy/mark-brown',
        },
        {
          slug: '/es/blogs/mark-brown',
        },
      ],
    },
    tonyBony: {
      name: 'Tony Bony',
      slug: '/blogs/tony-bony',
      translations: [
        {
          slug: '/cs/blogy/tony-bony',
        },
        {
          slug: '/es/blogs/tony-bony',
        },
      ],
    },
  }

  const articles = {
    goldTreasure: {
      title: 'How to find your first gold treasure?',
      slug: '/blogs/joe-black/how-to-find-your-first-gold-treasure',
      author: authors.joeBlack,
      translations: [
        {
          title: 'Jak najít svůj první zlatý poklad?',
          slug: '/cs/blogy/joe-black/jak-najit-svuj-prvni-zlaty-poklad',
        },
        {
          title: '¿Cómo encontrar tu primer tesoro de oro?',
          slug: '/es/blogs/joe-black/como-encontrar-ru-primer-tesoro-de-oro',
        },
      ],
    },
    betterHuman: {
      title: 'How to be a better human?',
      slug: '/blogs/mark-brown/how-to-be-a-better-human',
      author: authors.markBrown,
      translations: [
        {
          title: 'Jak být lepším člověkem?',
          slug: '/cs/blogy/mark-brown/jak-byt-lepsim-clovekem',
        },
        {
          title: '¿Cómo ser un humano mejor?',
          slug: '/es/blogs/mark-brown/como-ser-un-humano-mejor',
        },
      ],
    },
    topPlaces: {
      title: 'The most dangerous places to live',
      slug: '/blogs/tony-bony/the-most-dangerous-places-to-live',
      author: authors.tonyBony,
      translations: [
        {
          title: 'Nejnebezpečnější místa k životu',
          slug: '/cs/blogy/tony-bony/nejnebezpecnejsi-mista-k-zivotu',
        },
        {
          title: 'Los lugares más peligrosos para vivir',
          slug: '/es/blogs/tony-bony/los-lugares-mas-peligrosos-para-vivir',
        },
      ],
    },
    betterDay: {
      title: 'Top 5 colors which make your day better',
      slug: '/blogs/mark-brown/top-5-colors-which-make-your-day-better',
      author: authors.markBrown,
      translations: [
        {
          title: 'Top 5 barev pro lepší den',
          slug: '/cs/blogy/mark-brown/top-5-barev-pro-lepsi-den',
        },
        {
          title: 'Top 5 colores que mejoran tu día',
          slug: '/es/blogs/mark-brown/top-5-colores-que-mejoran-tu-dia',
        },
      ],
    },
    notRead: {
      title: 'Do not read this article at all!',
      slug: '/blogs/joe-black/do-not-read-this-article-at-all',
      author: authors.joeBlack,
      translations: [
        {
          title: 'Tenhle článek vůbec nečti!',
          slug: '/cs/blogy/joe-black/tenhle-clanek-vubec-necti',
        },
        {
          title: 'No leas este artículo en absoluto!',
          slug: '/es/blogs/joe-black/no-leas-este-articulo-en-absoluto',
        },
      ],
    },
  }

  const getPathName = (path: string) =>
    path.startsWith('/') ? path : `/${path}`

  describe('Languages', () => {
    languages.forEach((lng) => {
      it(`should switch to ${lng.name} language`, () => {
        // Start from the index page
        cy.visit(BASE_URL)

        // Find a link with an href attribute equals to language code and click it
        cy.get(`a[href="/${lng.code}"]`).contains(lng.name).first().click()

        // The new url should include selected language code
        cy.location('pathname').should('eq', getPathName(lng.code))

        lng.links.forEach((link) => {
          cy.get('a').contains(link)
        })
      })
    })
  })

  describe('Articles', () => {
    Object.values(articles).forEach((article) => {
      it(`should open and close article ${article.title} in modal`, () => {
        // Start from the index page
        cy.visit(BASE_URL)

        // Find a link with an href attribute equals to article slug and click it
        cy.get(`a[href="${article.slug}"]`).contains(article.title).click()

        // The new url should include article slug
        cy.location('pathname').should('eq', getPathName(article.slug))

        // The new page should contain an h1 with article title
        cy.getByTestId('modal')
          .find('h1')
          .should('exist')
          .contains(article.title)

        // The new page should contain an link to author details
        cy.getByTestId('modal')
          .find(`a[href="${article.author.slug}"]`)
          .should('exist')
          .contains(article.author.name)
          .click()

        cy.location('pathname').should('eq', getPathName(article.author.slug))

        // The new url should include author name
        cy.getByTestId('modal')
          .find('h1')
          .should('exist')
          .contains(article.author.name)

        // Go back to article modal
        cy.getByTestId('back-button').click()

        cy.location('pathname').should('eq', getPathName(article.slug))
        cy.getByTestId('modal').should('exist')

        // Close the modal
        cy.getByTestId('back-button').click()

        cy.location('pathname').should('eq', getPathName('/'))
        cy.getByTestId('modal').should('not.exist')
      })
    })

    Object.values(articles).forEach((article) => {
      it(`should open alternative to ${article.title} article`, () => {
        // Start from the index page
        cy.visit(BASE_URL)

        // Find a link with an href attribute equals to article slug and click it
        cy.get(`a[href="${article.slug}"]`).contains(article.title).click()

        article.translations.forEach((translation) => {
          // The new page should contain an link to translation
          cy.get(`a[href="${translation.slug}"]`)
            .should('exist')
            .contains(translation.title)
            .click()

          // The new url should include translation slug
          cy.location('pathname').should('eq', getPathName(translation.slug))

          // The new page should contain an h1 with translation title
          cy.get('h1').should('exist').contains(translation.title)
          cy.getByTestId('modal').should('not.exist')
        })
      })
    })
  })

  describe('Authors', () => {
    Object.values(authors).forEach((author) => {
      it(`should open and close author ${author.name} in modal`, () => {
        // Start from the index page
        cy.visit(BASE_URL)

        // Find a link with an href attribute equals to author slug and click it
        cy.get(`a[href="${author.slug}"]`).contains(author.name).click()

        // The new url should include author slug
        cy.location('pathname').should('eq', getPathName(author.slug))

        // The new page should contain an h1 with author name
        cy.getByTestId('modal').find('h1').should('exist').contains(author.name)

        // Close the modal
        cy.getByTestId('back-button').click()
        cy.getByTestId('modal').should('not.exist')
      })
    })

    Object.values(authors).forEach((author) => {
      it(`should open alternative to ${author.name} author`, () => {
        // Start from the index page
        cy.visit(BASE_URL)

        // Find a link with an href attribute equals to article slug and click it
        cy.get(`a[href="${author.slug}"]`).contains(author.name).click()

        author.translations.forEach((translation) => {
          // The new page should contain an link to translation
          cy.get(`a[href="${translation.slug}"]`)
            .should('exist')
            .contains(author.name)
            .click()

          // The new url should include translation slug
          cy.location('pathname').should('eq', getPathName(translation.slug))

          // The new page should contain an h1 with translation title
          cy.get('h1').should('exist').contains(author.name)
          cy.getByTestId('modal').should('not.exist')
        })
      })
    })
  })
})

// Prevent TypeScript from reading file as legacy script
export {}
