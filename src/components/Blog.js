import PropTypes from 'prop-types';
import React, { useState } from 'react';
import blogServices from '../services/blogs';

const Blog = ({
  blog, resorter, username, onLike = null,
}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };
  const [likes, setLikes] = useState(blog.likes);
  // just for test purposes
  if (!onLike) {
    // eslint-disable-next-line no-param-reassign
    onLike = async () => {
      try {
        // this block of code is not ideal but i'm just following the course..
        const response = await blogServices.likeBlog({
          ...blog,
          likes: likes + 1,
        });
        setLikes(() => response.likes);

        // resort the blogs -- this is a prop that internally changes parent states
        // and we don't control its behavior in anyway
        resorter();
      } catch (err) {
        // TODO: maybe use notification
      }
    };
  }
  // removing a blog
  async function removeHandler() {
    // eslint-disable-next-line no-alert
    if (window.confirm(`remove blog ${blog.title}! by ${blog.author}?`)) {
      await blogServices.deleteBlog(blog.id);
      resorter();
    }
  }
  const [displayMode, setDisplayMode] = useState(false);

  function toggleHandler() {
    setDisplayMode(!displayMode);
  }
  // TODO: could maybe use togglable here?
  return (
    <div style={blogStyle} datacy="blogStructure">
      {!displayMode ? (
        <>
          <p className="defaultParagraph">
            {blog.title}
            {' '}
            {blog.author}
            {' '}
            <button type="submit" onClick={toggleHandler}>view</button>
          </p>
        </>
      ) : (
        <>
          <p>
            {blog.title}
            {' '}
            {blog.author}
            {' '}
            <button type="submit" onClick={toggleHandler}>hide</button>
          </p>
          <p>{blog.url}</p>
          {/* class just used for testing purposes */}
          <p className="likes">
            likes:
            {' '}
            {likes}
            {' '}
            <button type="submit" onClick={onLike}>Like</button>
          </p>
          <p>{blog.user.username}</p>
          {/* remove option available only if blog created by current logged in user */}
          {blog.user.username === username && (
          <button type="submit" onClick={removeHandler}>remove</button>
          )}
        </>
      )}
    </div>
  );
};
Blog.defaultProps = {
  onLike: null,
  resorter: null,
  username: '',
};
Blog.propTypes = {
  blog: PropTypes.shape({
    author: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
    id: PropTypes.string,
    likes: PropTypes.number,
    user: PropTypes.shape({
      username: PropTypes.string,
    }),
  }).isRequired,
  username: PropTypes.string,
  resorter: PropTypes.func,
  onLike: PropTypes.func,
};

export default Blog;
