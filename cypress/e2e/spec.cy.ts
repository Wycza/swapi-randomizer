describe('Swapi Randomizer', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('.select__game').select('People');
  });

  it('should display play button a no result cards', () => {
    cy.get('app-play-button').should('be.visible');
    cy.get('.container__cards').should('not.exist');
  });

  it('should fetch people data and display results', () => {
    cy.get('app-play-button').click();
    cy.get('.container__cards').should('be.visible');
    cy.get('#select-game').contains('People');
  });

  it('should change game mode and then fetch starships data', () => {
    cy.get('.container__cards').should('not.exist');
    cy.get('.select__game').select('Starships');
    cy.get('#select-game').contains('Starships');
    cy.get('app-play-button').click();
    cy.get('.container__cards').should('be.visible');
  });

  it('should fetch data and then change game mode', () => {
    cy.get('app-play-button').click();
    cy.get('.container__cards').should('be.visible');
    cy.get('.select__game').select('Starships');
    cy.get('#select-game').contains('Starships');
  });
})
