import React, { useState } from "react";
import httpRequest from "../Components/DataFateching";

const Home = () => {
    const [postOfficeData, setPostOfficeData] = useState(null); // Store the complete response object
    const [search, setSearch] = useState("");
    const [error, setError] = useState(""); // Store error messages
    const [isInitial, setIsInitial] = useState(true); // Track if it's the initial stage

    const DataFetching = async () => {
        setIsInitial(false); // Update the initial stage
        try {
            if (!search) {
                setError("Please type your postal code for details.");
                setPostOfficeData(null);
                return;
            }
            const response = await httpRequest.get(`${Number(search)}`);
            if (response.status === 200 && response.data) {
                setPostOfficeData(response.data || null);
                setError(""); // Clear any existing errors
            } else {
                setPostOfficeData(null);
                setError("No results found for the entered postal code.");
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setError("No results found for the entered postal code.");
            } else {
                setError("An error occurred. Please try again later.");
            }
            setPostOfficeData(null); // Clear data on error
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setSearch(value);
            setError(""); // Clear error when typing
        }
    };

    return (
        <div className="mx-auto h-full bg-gradient-to-r from-gray-600 to-gray-900 p-10 ">
            <div className="mt-10 max-w-md mx-auto text-center">
                <p className="text-gray-200 border-2 shadow-lg shadow-gray-600 border-indigo-100 rounded-md my-2  py-2 font-sans font-bold text-3xl">
                    Post Office Finder.
                </p>
            </div>
            {/* Search Input */}
            <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-md py-8 overflow-hidden rounded-xl bg-white p-6 shadow-md">
                    <div className="flex overflow-hidden rounded-md bg-gray-200 focus-within:outline focus-within:outline-blue-500">

                        <input
                            type="text"
                            value={search}
                            onChange={handleInputChange}
                            placeholder="Enter Your Postal Code..."
                            className="w-full placeholder:text-gray-500 rounded-bl-md rounded-tl-md bg-gray-100 px-4 py-1 text-gray-700 focus:outline-none"
                        />
                        <button
                            onClick={DataFetching}
                            className="bg-blue-500 px-4 text-white duration-150 hover:bg-blue-600 focus:ring focus:ring-blue-300"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Initial Stage Message */}
            {isInitial && (
                <div className="mt-10 max-w-md h-[400px] backdrop-blur-sm justify-center mx-auto  text-center bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Divisions_of_Bangladesh.png/671px-Divisions_of_Bangladesh.png')] bg-cover bg-no-repeat rounded-lg shadow-md p-10">
                    <h2 className="text-1xl sm:text-2xl bg-transparent text-gray-900 font-bold mb-4">
                        Get Started with Your Search
                    </h2>
                    <p className="text-gray-700  font-semibold">
                        Please type your postal code to begin searching.
                    </p>

                </div>
            )}

            {/* Error or Instruction Messages */}
            {error && !isInitial && (
                <div className="mt-10 max-w-md mx-auto">
                    <div className="bg-gradient-to-r from-slate-500 to-stone-700 border rounded-lg shadow-md p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="w-16 h-16 text-red-800"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M10.34 3.705a9 9 0 0 1 13.95 9.788 9 9 0 0 1-9.788 13.95 9 9 0 0 1-9.787-13.95 9 9 0 0 1 5.625-9.788l1.474 2.599z"
                                />
                            </svg>
                        </div>
                        <p className="text-red-700 font-medium">{error}</p>
                        <p className="text-gray-200 mt-2">
                            We couldn’t find any data for the entered postal code. Please check the postal code and try again.
                        </p>

                    </div>
                </div>
            )}

            {/* Post Office Data */}
            {postOfficeData && (
                <div className=" max-w-lg my-2 mx-auto">
                    <div className="bg-gradient-to-r from-yellow-200 to-green-500 shadow-lg rounded-lg p-6 border">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Post Code: <span className="text-blue-600">{postOfficeData["post code"]}</span>
                        </h2>
                        <p className="text-gray-600 mb-2">
                            Country: <span className="text-gray-800 font-semibold">{postOfficeData.country}</span>
                            (<span className="text-gray-500">{postOfficeData["country abbreviation"]}</span>)
                        </p>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Places:</h3>
                        <div>
                            {postOfficeData.places.map((place, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 border rounded-lg p-4 mb-4 shadow-sm"
                                >
                                    <p className="text-gray-800 font-medium">
                                        Place Name: <span className="text-blue-600">{place["place name"]}</span>
                                    </p>
                                    <p className="text-gray-600">
                                        State: <span className="text-gray-800">{place.state}</span>
                                    </p>
                                    <p className="text-gray-600">
                                        Longitude: <span className="text-gray-800">{place.longitude}</span>, Latitude:{" "}
                                        <span className="text-gray-800">{place.latitude}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
