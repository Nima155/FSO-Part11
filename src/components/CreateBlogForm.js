import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CreateBlogForm = ({ formSubmission }) => {
  const [url, setUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');

  function onFormSubmit(event) {
    event.preventDefault();
    formSubmission({ url, author, title });
    setUrl('');
    setAuthor('');
    setTitle('');
  }

  return (
    <form onSubmit={onFormSubmit}>
      <label>
        title:
        <input
          id="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </label>
      <br />
      <label>
        author:
        <input
          id="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </label>
      <br />
      <label>
        url:
        <input
          id="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </label>
      <br />
      <button type="submit" id="createButton">create</button>
    </form>
  );
};

CreateBlogForm.propTypes = {
  formSubmission: PropTypes.func.isRequired,
};

export default CreateBlogForm;
