// import React, { useState } from 'react';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     // Handle login logic here
//     console.log('Logging in with:', email, password);
//   };

//   return (
//     <div className="container mx-auto my-8 px-12">
//       <h1 className="text-3xl font-bold mb-4">Login</h1>
//       <form>
//         <div className="mb-4 flex items-center">
//           <label htmlFor="email" className="block text-base font-medium text-gray-600">
//            <b> Email </b>
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="mt-1 p-2 border rounded-md w-full"
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="password" className="block text-base font-medium text-gray-600">
//            <b> Password </b>
//           </label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="mt-1 p-2 border rounded-md w-full"
//           />
//         </div>
//         <button
//           type="button"
//           onClick={handleLogin}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';

const ProfileCard = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    password: '********',
    department: 'Engineering',
    profilePic: 'https://placekitten.com/200/200', // Example profile picture URL
    dateOfJoining: '2022-01-01', // Example date of joining
  });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-8 rounded-md shadow-md">
        <img
          src={profile.profilePic}
          alt="Profile"
          className="w-32 h-32 mx-auto mb-4 rounded-full"
        />
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">{profile.name}</h2>
          <p className="text-base text-gray-600">{profile.department}</p>
        </div>
        <div className="mt-6">
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Email:</span> {profile.email}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Password:</span> {profile.password}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Date of Joining:</span> {profile.dateOfJoining}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

