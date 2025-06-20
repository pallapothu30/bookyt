import React from "react";

const BookCard = ({ title, isbnNumber, price, coverPic, createdBy }) => {
  return (
    <div className="relative flex flex-col bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow duration-300 group">
      {/* Cover Image */}
      <div className="w-full h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={coverPic}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Book Info */}
        <div className="flex flex-col flex-1 p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">{title}</h2> {/* Removed truncate */}
        <p className="text-sm text-gray-500 mb-2 truncate">ISBN: {isbnNumber}</p>
        <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-bold text-blue-700">₹{price}</span>
            {createdBy && (
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                {createdBy}
            </span>
            )}
        </div>
        </div>
    </div>
  );
};

export default BookCard;