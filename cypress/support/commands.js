Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('#firstName').type('João')
    cy.get('#lastName').type('Neto C.')
    cy.get('#email').type('joaonetoc@gmail.com')
    cy.get('#open-text-area').type('short text', {delay: 0})
    cy.contains('button', 'Enviar').click()
    cy.get('.success').should('be.visible')
})