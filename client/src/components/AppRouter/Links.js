import React from 'react';
import { Link } from 'react-router-dom'

const Links = ({ path, content, subLink }) => {
  if (subLink !== undefined) {
    return <nav className='nav'>
      <ul>
        <li>
          <Link to={path}>{content}</Link>
          {subLink.map((link) => <Links {...link} />)}
        </li>
      </ul>
    </nav>;
  }
  return <nav className='nav'>
     <ul>
        <li><Link to={path}>{content}</Link></li>
     </ul>
   </nav>;
};

export default Links;