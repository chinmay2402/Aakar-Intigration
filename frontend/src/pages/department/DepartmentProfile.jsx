import React from 'react';
import { useParams } from 'react-router-dom';

function DepartmentProfile() {
    const { id } = useParams(); // Get the user ID from the URL

    return (
        <div>
            <h1>User Profile</h1>
            <p>Profile of user with ID: {id}</p>
            {/* Fetch and display user details based on userId */}
        </div>
    );
}

export default DepartmentProfile;
