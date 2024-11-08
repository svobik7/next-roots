/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

// Cypress E2E Test
describe('Books', () => {
  const BASE_URL = 'http://localhost:3000/books'

  const books = {
    arseneLupin: {
      title: 'Arsene Lupin, Gentleman-Thief',
      slug: '/books/arsene-lupin-gentleman-thief',
      translations: [
        {
          title: 'Arsene Lupin, Lupič gentleman',
          slug: '/cs/knihy/arsene-lupin-lupic-gentleman',
        },
        {
          title: 'Arsene Lupin, Un caballero ladrón',
          slug: '/es/libros/arsene-lupin-un-caballero-ladron',
        },
      ],
    },
  }

  const getPathName = (path: string) =>
    path.startsWith('/') ? path : `/${path}`

  Object.values(books).forEach((book) => {
    it(`should open detail of book ${book.title} with alternatives`, () => {
      // Start from the index page
      cy.visit(BASE_URL)

      // Find a link with an href attribute equals to article slug and click it
      cy.get(`a[href="${book.slug}"]`).contains(book.title).click()

      // The new url should include article slug
      cy.location('pathname').should('eq', getPathName(book.slug))

      // The new page should contain an h1 with article title
      cy.get('h1').should('exist').contains(book.title)

      book.translations.forEach((translation) => {
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
