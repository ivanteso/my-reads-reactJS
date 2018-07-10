import React from 'react';
import { Link } from 'react-router-dom'
import sortBy from 'sort-by';
import {DebounceInput} from 'react-debounce-input';
//import PropTypes from 'prop-types';

function SearchBook(props) {

  props.bookFoundList.sort(sortBy('title'))

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link className="close-search" to='/'>Close</Link>
        <div className="search-books-input-wrapper">

          <DebounceInput
            type="text"
            placeholder="Search by title or author"
            debounceTimeout={300}
            value={props.onQuery}
            onChange={ (event) => props.onSearch(event.target.value) }
          />

        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {props.bookFoundList.map((book) => (
            <li key={book.id}>
              <div className="book">
                <div className="book-top">
                  <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})`, backgroundSize: '100% 100%' }}></div>
                  <div className="book-shelf-changer">
                    <select>
                      <option value="move" disabled>Move to...</option>
                      <option value="currentlyReading">Currently Reading</option>
                      <option value="wantToRead">Want to Read</option>
                      <option value="read">Read</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
                <div className="book-title">{book.title}</div>
                <div className="book-authors">{book.authors}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default SearchBook
