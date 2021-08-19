import React, { useState } from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({ onFormSubmission }) => {
  // this is not bad practice because username and password are not needed by
  // the parent component, so they can be states here.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  async function onFormSubmit(e) {
    // prevent page refresh
    e.preventDefault();
    await onFormSubmission({ username, password });
  }

  return (
    <form onSubmit={onFormSubmit}>
      <label>
        username
        <input
          id="username"
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </label>
      <br />
      <label>
        password
        <input
          id="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

LoginForm.propTypes = {
  onFormSubmission: PropTypes.func.isRequired,
};

export default LoginForm;
