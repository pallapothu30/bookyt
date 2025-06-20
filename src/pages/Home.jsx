import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/Firebase";
import BookCard from "../components/Card";
const HomePage = () => {
  const firebase = useFirebase();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    firebase.listAllBooks().then((snapshot) => {
      setBooks(snapshot.docs);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8">
      {/* Heading */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 Books Listed</h1>
        <p className="text-sm text-gray-500">Explore all the books uploaded by our users</p>
      </div>

      {/* Books Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length > 0 ? (
          books.map((bookDoc) => {
            const data = bookDoc.data();
            return (
              <BookCard
                key={bookDoc.id}
                title={data.title}
                isbnNumber={data.isbnNumber}
                price={data.price}
                coverPic={data.coverPicUrl}
                createdBy={data.displayName || data.userEmail}
              />
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-600 text-md">
            No books listed yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;