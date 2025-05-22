import Head from 'next/head';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Add event listener after component mounts (client-side only)
    const form = document.getElementById('userForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
          name: e.target.name.value,
          email: e.target.email.value,
        };
        const response = await fetch('/api/add-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        alert(result.message);
      });
    }
    
    // Cleanup function to remove event listener
    return () => {
      const form = document.getElementById('userForm');
      if (form) {
        form.removeEventListener('submit', () => {});
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>User Registration</title>
      </Head>
      
      <div className="container">
        <h2>Register User</h2>
        <form id="userForm">
          <input name="name" placeholder="Name" required />
          <input name="email" placeholder="Email" required />
          <button type="submit">Submit</button>
        </form>
      </div>
      
      <style jsx global>{`
        body {
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
        }
        h2 {
          color: #333;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        input {
          margin-bottom: 10px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        button {
          background-color: #4CAF50;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #45a049;
        }
      `}</style>
    </>
  );
}
