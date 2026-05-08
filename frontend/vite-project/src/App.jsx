import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/RootLayout.jsx"
import Home from "./components/Home.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import UserProfile from "./components/UserProfile.jsx";
import AdminProfile from "./components/AdminProfile.jsx";
import UsersList from "./components/UsersList.jsx";
import AuthorList from "./components/AuthorList.jsx";
import AuthorProfile from "./components/AuthorProfile.jsx";
import AuthorArticles from "./components/AuthorArticles.jsx";
import EditArticle from './components/EditArticle.jsx'
import WriteArticles from "./components/WriteArticles.jsx";
import ArticleByID from "./components/ArticleById.jsx";
import {Toaster} from 'react-hot-toast'
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Unauthorized from "./components/Unauthorized.jsx";

const routerObj = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "user-profile",
        element: (
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserProfile />
          </ProtectedRoute>
        )
      },
      {
        path: "author-profile",
        element: (
          <ProtectedRoute allowedRoles={["AUTHOR"]}>
            <AuthorProfile />
          </ProtectedRoute>
        ),

        children: [
          {
            index: true,
            element: <AuthorArticles />,
          },
          {
            path: "articles",
            element: <AuthorArticles />,
          },
          {
            path: "write-article",
            element: <WriteArticles />,
          },
        ],
      },
      {
        path: "admin-profile",
        element: (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminProfile />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <UsersList />,
          },
          {
            path: "users",
            element: <UsersList />,
          },
          {
            path: "authors",
            element: <AuthorList />,
          }
        ]
      },
      {
        path: "article/:id",
        element: (
          <ProtectedRoute allowedRoles={["USER", "AUTHOR"]}>
            <ArticleByID />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-article",
        element: (
          <ProtectedRoute allowedRoles={["AUTHOR"]}>
            <EditArticle />
          </ProtectedRoute>
        ),
      },
      {
        path: 'unauthorized',
        element: <Unauthorized />
      }
    ],
  },
]);

function App() {
  return (
    <div>
        <Toaster position="top-center" reverseOrder={false}/>
        <RouterProvider router={routerObj} />
    </div>
  );
}

export default App;