import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import SearchBook from './SearchBook'
import BooksList from './BooksList'

class BooksApp extends React.Component {
  state = {
     // States used by BooksList
     currentlyReading: [],
     wannaRead: [],
     read: [],
     allBooks: []
  }

  componentDidMount() {
    // Empty arrays to fill after getAll is called from BooksAPI
    const currentlyReading = [];
    const wannaRead = [];
    const read = [];
    const allBooks = [];

    // Get all books
    BooksAPI.getAll().then(books => {
      // Loop over all books and push them into the right array
      // depending on their .shelf value
      books.forEach(book => {
        if (book.shelf === 'currentlyReading') {
          currentlyReading.push(book);
        } else if (book.shelf === 'wantToRead') {
          wannaRead.push(book);
        } else if (book.shelf === 'read') {
          read.push(book);
        }
        allBooks.push(book)
      })
      // set the arrays as new state
      this.setState({ currentlyReading, wannaRead, read, allBooks })
    })
  }


  render() {
    return (

      <div className="app">

          <SearchBook />

          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>

                <BooksList
                  shelf={this.state.currentlyReading}
                  shelfName='Currently Reading'/>
                <BooksList
                  shelf={this.state.wannaRead}
                  shelfName='Want To Read'/>
                <BooksList
                  shelf={this.state.read}
                  shelfName='read'/>

              </div>
            </div>

            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
      </div>
    )
  }
}

export default BooksApp
