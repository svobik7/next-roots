/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

// Cypress E2E Test
describe('Others', () => {
  const BASE_URL = 'http://localhost:3000'

  const pages = {
    about: {
      title: 'About',
      slug: '/about',
      translations: [
        {
          title: 'O nás',
          slug: '/cs/o-nas',
        },
        {
          title: 'Sobre',
          slug: '/es/sobre',
        },
      ],
    },
    contacts: {
      title: 'Contacts',
      slug: '/contacts',
      translations: [
        {
          title: 'Kontakty',
          slug: '/cs/kontakty',
        },
        {
          title: 'Contactos',
          slug: '/es/contactos',
        },
      ],
    },
  }

  const getPathName = (path: string) =>
    path.startsWith('/') ? path : `/${path}`

  Object.values(pages).forEach((page) => {
    it(`should open page ${page.title} with alternatives`, () => {
      // Start from the index page
      cy.visit(BASE_URL + getPathName(page.slug))

      // The new page should contain an h1 with article title
      cy.get('h1').should('exist').contains(page.title)

      page.translations.forEach((translation) => {
        // The new page should contain an link to translation
        cy.get(`a[href="${translation.slug}"]`)
          .should('exist')
          .contains(translation.title)
          .click()

        // The new url should include translation slug
        cy.location('pathname').should('eq', getPathName(translation.slug))

        // The new page should contain an h1 with translation title
        cy.get('h1').should('exist').contains(translation.title)
      })
    })
  })
})

// Prevent TypeScript from reading file as legacy script
export {}
