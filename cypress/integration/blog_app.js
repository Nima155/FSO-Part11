// we dont use arrow functions as recommended by Mocha docs
import DB_DATA from '../../src/utils/cypress_test_helper';

describe('Blog app', () => {
  const Users = [
    {
      username: 'nima155',
      password: 'chandlerBing',
    },
    {
      username: 'godBolt',
      password: 'ggHadid123',
    },
  ];

  beforeEach(() => {
    // POST request so as to conform to RESTful conventions
    cy.request('POST', 'http://localhost:3000/api/testing/reset');

    // create a new user
    cy.request('POST', 'http://localhost:3000/api/users/', Users[0]);
    // secondary user
    cy.request('POST', 'http://localhost:3000/api/users/', Users[1]);
    // visit main page
    cy.visit('http://localhost:3000');
  });
  // it => analogues to test in Jest
  it('Login form is shown', () => {
    cy.contains('Login');
    cy.contains('log in to application');
  });

  describe('Login', () => {
    it('succeeds with correct credentials', () => {
      cy.login(Users[0].username, Users[0].password);
      cy.contains(`${Users[0].username} logged in`);
    });

    it('fails with wrong credentials', () => {
      cy.contains('Login').click();
      cy.contains('wrong username or password').should(
        'have.css',
        'color',
        'rgb(255, 0, 0)',
      );
    });
  });
  describe('When logged in', () => {
    beforeEach(() => {
      // custom command

      cy.login(Users[0].username, Users[0].password);
    });

    it('A blog can be created', () => {
      // custom command
      cy.createBlog(DB_DATA[0]);
      cy.contains(`${DB_DATA[0].title} ${DB_DATA[0].author}`);
    });
    describe('When a blog is there', () => {
      beforeEach(() => {
        DB_DATA.forEach((ele) => {
          cy.createBlog(ele);
        });
      });
      it('A user can like a blog', () => {
        cy.contains(DB_DATA[2].title).parent().as('parent');
        // special syntax allowed by the   as   method above
        cy.get('@parent').find('button').click();

        cy.contains(`likes: ${DB_DATA[2].likes}`);
        // click like button
        cy.contains('Like').click();
        // check for an increase
        cy.contains(`likes: ${DB_DATA[2].likes + 1}`);
      });
      it('The creator of blog can delete the blog', () => {
        cy.contains(DB_DATA[0].title).parent().contains('view').click();
        // only the creator of a blog can remove that blog
        cy.contains(DB_DATA[0].title).parent().contains('nima155');
        // remove button is there
        cy.contains(DB_DATA[0].title).parent().contains('remove').click();
        // the blog is no longer there
        cy.contains(DB_DATA[0].title).should('not.exist');
      });

      it('Other users cannot delete blogs that don\'t belong to them', () => {
        cy.login(Users[1].username, Users[1].password);

        cy.contains(DB_DATA[0].title).parent().contains('view').click();
        // only the creator of a blog can remove that blog
        cy.contains(DB_DATA[0].title).parent().should('not.contain', 'remove');
      });

      it('returned blogs are sorted in descending order of likes', () => {
        const listOfLikes = [];
        //     custom attribute => best practice as it does not interfere
        cy.get('[datacy=blogStructure]').then(($blogs) => {
          // this is jQuery which cypress uses
          $blogs.each((i, el) => {
            el.querySelector('button').click();
            listOfLikes.push(
              // convert to Number then push to array
              +el.querySelector('.likes').textContent.split(' ')[1],
            );
            // console.log(listOfLikes)
          });
          const sorted = listOfLikes.concat().sort((a, b) => b - a);
          // mocha test query
          expect(listOfLikes).deep.to.equal(sorted);
        });
        // console.log(listOfLikes)
      });
    });
  });
});
