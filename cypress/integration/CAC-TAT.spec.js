/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function(){
    beforeEach(function() {
        cy.visit('./src/index.html')  
    })

    it('verifica o titulo da aplicação', function() {        
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
        const longText = 'Teste, teste, teste, teste, teste, teste, teste, teste, teste, teste'
        cy.get('#firstName').type('Bruno')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('bruno@teste@com')
        cy.get('#open-text-area').type(longText, {delay: 0 }) // delay 0 ele copia mais rapido os dados no input
        cy.get('button[type="submit"]').click()
        cy.get('.success').should('be.visible') 
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.get('#firstName').type('Bruno')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('bruno.teste.com') // email sem @
        cy.get('#open-text-area').type('teste')
        cy.get('button[type="submit"]').click() 
        cy.get('.error').should('be.visible') 
    })

    it('Campo telefone continua vazio quando preenchido com valor não numérico', function(){
        cy.get('#phone')
            .type('aadasada')
            .should('have.value', '')   // o valor de resposta é um string vazia porque não aceita não numerico
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.get('#firstName').type('Bruno')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('bruno@teste.com')
        cy.get('#phone-checkbox').click()
        cy.get('#open-text-area').type('teste')
        cy.get('button[type="submit"]').click() 
        cy.get('.error').should('be.visible') // deu erro pois inserir o telefone é obrigatório
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        cy.get('#firstName').type('Bruno').should('have.value', 'Bruno')
            .clear() // limpar o campo
            .should('have.value', '')
        cy.get('#lastName').type('Souza').should('have.value', 'Souza')
            .clear()
            .should('have.value', '')
        cy.get('#email').type('bruno@teste.com').should('have.value', 'bruno@teste.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone').type('1234567890').should('have.value', "1234567890")
            .clear()
            .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
         cy.get('button[type="submit"]').click()
         cy.get('.error').should('be.visible')   // só para verificar se está aparecendo a mensagem de erro
    })

    it('envia o formuário com sucesso usando um comando customizado', function(){
       cy.fillMandatoryFieldsAndSubmit() // cria um comando customizado na pasta support/commands
       cy.get('.success').should('be.visible')
    })

    it('Uso do contains ao inves do get', function(){
        cy.get('#firstName').type('Bruno')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('bruno@teste.com')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click() // encontrar um botão que tenha enviar dentro dele
    })

    it('seleciona um produto (YouTube) por seu texto', function(){
        cy.get('#product').select('YouTube')
            .should('have.value', 'youtube') // youtube está minusculo pq está verificando o value ( elemento dentro do inspetor de elementos)
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function(){
        cy.get('#product').select('mentoria') // está selecionando pelo Value por isso está minusculo
        .should('have.value', 'mentoria') 
    })

    it('seleciona um produto (Blog) por seu índice', function(){
        cy.get('#product').select(1) // ele está na posição 2, mas começa com índice 0 o JS, por isso indice 1
        .should('have.value', 'blog') 
    })

    it('marca o tipo de atendimento "Feedback" CHECKBOX', function(){
        cy.get('input[type="radio"][value="feedback"]').check() // usando o inspetor para coletar o input e usando check
         .should('have.value', 'feedback') 
        //cy.get('#support-type > :nth-child(4)').click() // usando inspetor do cypress e usando o click
    })
    
    it('marca cada tipo de atendimento - CHECKBOX', function() {
        cy.get('input[type="radio"]')
        .should('have.length', 3)
        .each(function($radio){
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    })

    it('marca ambos checkboxes, depois desmarca o último no CHECKBOX', function(){
        cy.get('input[type="checkbox"]').check() // marcou os 2 checkbox da página
         .should('be.checked')  // confirmou que os 2 checkboxs estão marcados
         .last().uncheck() // last pegou o último checkbox e desmarcou com uncheck
         .should('not.be.checked')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.get('#firstName').type('Bruno')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('bruno@teste.com')
        cy.get('#phone-checkbox').check()         // ao inves do click vamos utilizar o check
        cy.get('#open-text-area').type('teste')
        cy.get('button[type="submit"]').click() 
        cy.get('.error').should('be.visible')  
    })   
    
    it('seleciona um arquivo da pasta fixtures - UPLOAD de Arquivos', function(){
        cy.get('#file-upload').should('not.have.value') // só para confirmar que não tem nenhum arquivo selecionado
        .selectFile('./cypress/fixtures/example.json')    

    })  
    
    it('seleciona um arquivo simulando um drag-and-drop', function() {
        cy.get('#file-upload').should('not.have.value') 
        .selectFile('./cypress/fixtures/example.json' , { action : 'drag-drop'})  // objeto drag and drop
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json').as('ArquivoExemplo')
        cy.get('#file-upload')
        .selectFile('@ArquivoExemplo')
        .should(function($input){
            expect($input[0].files[0].name).to.be.equal('example.json')
        })
           
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank') // sem precisar clicar está verificando atraves desse should que o link ( politica de privacidade )vai abrir em outra aba, através da validação
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')
        .invoke('removeAttr', 'target') // remove o target do html e abre a página na mesma página e não em uma nova aba
        .click()

        cy.contains('Talking About Testing').should('be.visible')
    })    

}) 