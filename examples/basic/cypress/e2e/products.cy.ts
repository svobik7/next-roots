/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

// Cypress E2E Test
describe('Products', () => {
  const BASE_URL = 'http://localhost:3000/products'

  const products = {
    macBook: {
      title: 'MacBook Pro M3 Space Black',
      slug: '/products/mac-book-pro-m3/space-black',
      translations: [
        {
          title: 'MacBook Pro M3 Vesmírně šedá',
          slug: '/cs/produkty/mac-book-pro-m3/vesmirne-seda',
        },
        {
          title: 'MacBook Pro M3 Negro Espacial',
          slug: '/es/productos/mac-book-pro-m3/negro-espacial',
        },
      ],
    },
  }

  const getPathName = (path: string) =>
    path.startsWith('/') ? path : `/${path}`

  Object.values(products).forEach((product) => {
    it(`should open detail of product ${product.title} with alternatives`, () => {
      // Start from the index page
      cy.visit(BASE_URL)

      // Find a link with an href attribute equals to article slug and click it
      cy.get(`a[href="${product.slug}"]`).contains(product.title).click()

      // The new url should include article slug
      cy.location('pathname').should('eq', getPathName(product.slug))

      // The new page should contain an h1 with article title
      cy.get('h1').should('exist').contains(product.title)

      product.translations.forEach((translation) => {
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
