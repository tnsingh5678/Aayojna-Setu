import { useState } from "react";
import HomeNav from "../component/components/HomeNav";
import Footer from "../component/components/Footer";
import { schemes } from "../schemes"; 
import { Link } from "react-router-dom";


export default function Schemes() {
 
  const [expandedScheme, setExpandedScheme] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const schemesPerPage = 5;
  const filteredSchemes = schemes.filter(
    (scheme) =>
      (scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.shortDetail.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === "" ||
        scheme.categories.includes(selectedCategory))
  );
  const indexOfLastScheme = currentPage * schemesPerPage;
  const indexOfFirstScheme = indexOfLastScheme - schemesPerPage;
  const currentSchemes = filteredSchemes.slice(indexOfFirstScheme, indexOfLastScheme);

  const toggleReadMore = (index) => {
    setExpandedScheme(expandedScheme === index ? null : index);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredSchemes.length / schemesPerPage);
  console.log(schemes.length,indexOfLastScheme,filteredSchemes.length)

  return (
    <>
      <div className="flex justify-between bg-sky-400">
      <div>
      <img src="./AS_L2.jpg" className="h-[150px] w-[150px] bg-blue-600 p-1"></img>
      </div>
      <div>

      <video
      src="./TECHNOLOGY.mp4" 
      className="h-[150px] w-[150px] bg-blue-600 p-1 object-cover"
      autoPlay
      loop
      muted
    />
      </div>
      
    
      </div>
      <div className="flex h-auto justify-between bg-orange-400">
        <div className="justify">
      {/* <img src="./AS_L2.jpg" className="h-[100px] w-[100px] bg-blue-600 p-1"></img> */}
      </div>
        <HomeNav />
      </div>
      <div>
        <h1 className="text-4xl text-center m-4">Schemes</h1>
        <a href="https://www.myscheme.gov.in/find-scheme" className="p-2 m-2 w-100px border bg-blue-600 rounded-lg">Know About All Schemes</a>
      </div>

      <div className="flex justify-center p-4">
        <input
          type="text"
          placeholder="Search by scheme name or detail..."
          className="p-2 border border-gray-300 rounded-lg w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex justify-center p-4">
        <select
          className="p-2 border border-gray-300 rounded-lg"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="BPL">BPL</option>
          <option value="Below 10">Below 10 years</option>
          <option value="School Student">School Student</option>
          <option value="College Student">College Student</option>
          <option value="Working Professional">Working Professional</option>
          <option value="Vocational">Vocational</option>
          <option value="Disabled">Disabled</option>
          <option value="RTE">RTE</option>
          <option value="Minority">Minority</option>
          <option value="General">General</option>
          <option value="Schedule Caste">Schedule Caste</option>
          <option value="Schedule Tribe">Schedule Tribe</option>
          <option value="OBCs">OBCs</option>
          <option value="EWS">EWS</option>
          <option value="Women">Women</option>
          <option value="Research">Reasearch</option>
          <option value="Ex-Servicemen"></option>
        </select>
      </div>
      <div className="p-4 text-center">
        <p>{`${filteredSchemes.length} results found out of ${schemes.length} matches`}</p>
      </div>
      

      <div className="p-4">
      <div className="p-4">
  {currentSchemes.map((scheme, index) => (
    <div
      key={index}
      className="mb-4 p-4 border bg-white border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-lg transition duration-300"
    >
      <a
        href={scheme.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl font-semibold text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition duration-200"
      >
        {scheme.name}
      </a>
      <p className="mt-2 text-gray-700 dark:text-gray-300">{scheme.shortDetail}</p>
      {expandedScheme === index && (
        <>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{scheme.fullDetail}</p>
        </>
      )}
      <button
        className="text-blue-500 mt-2 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition duration-200"
        onClick={() => toggleReadMore(index)}
      >
        {expandedScheme === index ? "Read Less" : "Read More"}
      </button>
    </div>
  ))}
</div>


<div className="flex justify-center mt-4">
  {(() => {
    // Calculate the start and end page numbers
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    // Adjust the start page if there are not enough pages before it
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - (maxButtons - 1));
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => (
      <button
        key={startPage + index}
        className={`mx-2 p-2 border border-gray-300 rounded-lg ${
          currentPage === startPage + index ? "bg-blue-500 text-white" : ""
        }`}
        onClick={() => handlePageChange(startPage + index)}
      >
        {startPage + index}
      </button>
    ));
  })()}
</div>

      </div>
      <div>
      
        
      </div>

      <Footer />
    </>
  );
}
