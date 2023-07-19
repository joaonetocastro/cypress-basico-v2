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
        cy.contains('button', 'Enviar').click()
        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação errada', function () {
        cy.get('#firstName').type('João')
        cy.get('#lastName').type('Neto C.')
        cy.get('#email').type('email_invalido')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não-numérico', () => {
        cy.get('#phone')
          .type('abcdefghij')
          .should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigarório mas não é preenchido', () => {
        cy.get('#firstName').type('João')
        cy.get('#lastName').type('Neto C.')
        cy.get('#email').type('email_invalido')
        cy.get('#phone-checkbox').click()
        
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName').type('Walmyr').should('have.value', 'Walmyr').clear().should('have.value', '');
        cy.get('#lastName').type('Walmyr').should('have.value', 'Walmyr').clear().should('have.value', '');
        cy.get('#email').type('walmyr@gmail.com').should('have.value', 'walmyr@gmail.com').clear().should('have.value', '');
        cy.get('#phone').type('123456789').should('have.value', '123456789').clear().should('have.value', '');
        cy.get('#open-text-area').type('teste').should('have.value', 'teste').clear().should('have.value', '');
    })

    it('exibe menagem de erro ao enviar o formulario sem preencher dados obrigatórios', () => {
        cy.contains('button', 'Enviar').click();
        cy.get('.error').should('be.visible');
    })

    it('envia com sucesso com comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit()
    })

    it('seleciona um produto', () => {
        cy.get('#product').select('Mentoria').should('have.value', 'mentoria')
    })

    it('seleciona um produto', () => {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    })

    it('seleciona um radio button', () => {
        cy.get('input[type=radio][value=feedback]').check().should('have.value', 'feedback')
    })

    it('Marca cada tipo de atendimento', () => {
        cy.get('input[type=radio]')
        .should('have.length', 3)
        .each(function(radio) {
            cy.wrap(radio).check().should('be.checked')
        })
    })

    it('marca ambos os checkboxes e depois desmarca o ultimo', () => {
        cy.get('[type=checkbox]')
        .check()
        .last()
        .uncheck()
        .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('#file-upload')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json')
        .should((input) => {
            expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('#file-upload')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})
        .should((input) => {
            expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo da pasta fixtures com alias', () => {
        cy.fixture('example.json').as('sampleFile')
        
        cy.get('#file-upload')
        .should('not.have.value')
        .selectFile('@sampleFile', {action: 'drag-drop'})
        .should((input) => {
            expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('verifica que a politica de privacidade abre em outra aba sem a necessidade de um click', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('verifica que a politica de privacidade abre em outra aba', () => {
        cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()

        cy.contains('Talking About Testing').should('be.visible')
    })

    it('deve mostrar a mensagem de erro por 3 segundos', () => {
        cy.clock()
        
        cy.contains('button', 'Enviar').click();
        cy.get('.error').should('be.visible');

        cy.tick(2999)
        cy.get('.error').should('be.visible');

        cy.tick(1)
        cy.get('.error').should('not.be.visible');
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Mensagem enviada com sucesso.')
          .invoke('hide')
          .should('not.be.visible')
        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios!')
          .invoke('hide')
          .should('not.be.visible')
      })

      it('preenche área de texto usando o comando invoke', () => {
        const text = Cypress._.repeat('Lorem Ipsum ', 20)
        cy.get('#open-text-area').invoke('val', text).should('have.value', text)
      })

      it('faz uma requisição HTTP', () => {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
        .should(function(response) {
            const {status, statusText, body} = response

            expect(status).to.equal(200)
            expect(statusText).to.equal('OK')
            expect(body).to.include('CAC TAT')
        })
      })

      it.only('Encontra o gato', () => {
        cy.contains('🐈').invoke('show').should('be.visible')
      })
})