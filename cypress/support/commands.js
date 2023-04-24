Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
   cy.get('#firstName').type('Bruno')
   cy.get('#lastName').type('Souza')
   cy.get('#email').type('bruno@teste.com')
   cy.get('#open-text-area').type('Teste')
   cy.get('button[type="submit"]').click()
})