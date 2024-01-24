import React from 'react';
import { Link } from 'react-router-dom';


const SideBar = () => {
    return (
        <div className="sidebar">
            <div className="tab">
                <Link to="/discovery">Discovery</Link>
            </div>
            <div className="tab">
                <Link to="/">Sign Out</Link>
            </div>
        </div>
    );
};

export default SideBar;