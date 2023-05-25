/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {
    beforeEach(() => {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
        cy.get('input[name="firstName"]').should('be.visible').type('Olá mundo!').should('have.value', 'Olá mundo!')
    })

    it('preencha os campos obrigatórios e envia o formulario', function() {
        const longText = 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum '
        
        cy.get('#firstName').type('João')
        cy.get('#lastName').type('Neto C.')
        cy.get('#email').type('joaonetoc@gmail.com')
        cy.get('#open-text-area').type(longText, {delay: 0})
        cy.get('button[type=submit]').click()
        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação errada', function () {
        cy.get('#firstName').type('João')
        cy.get('#lastName').type('Neto C.')
        cy.get('#email').type('email_invalido')
        cy.get('#open-text-area').type('teste')
        cy.get('button[type=submit]').click()
        cy.get('.error').should('be.visible')
    })
})