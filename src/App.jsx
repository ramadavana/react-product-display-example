import { useEffect } from "react";
import { useState } from "react";

/* Daftar Tugas Anda */
/*
  1. Tampilkan seluruh data Product dari API dummyJson (URL API ada dibawah)
  2. Buat tampilan katalog product seperti desain UI yg telah dibuat (URL Desain User Interface ada di bawah)
  3. Pastikan tampilan web responsive (aman di semua device)
  4. Terapkan pagination seperti di desain UI pada katalog product
  5. Buat input text di atas katalog product untuk melakukan pencarian product
  6. Buat beberapa button/dropdown untuk list Category di atas katalog Product, 
    jika di klik maka katalog product dengan category terpilih saja yg tampil
  7. Buat button/dropdown untuk melakukan sorting katalog product
  8. [Optional] buat animasi skeleton card ketika data product sedang di load
  9. [Optional] buat animasi ketika card katalog product di hover seperti di desain UI
*/

/* Rules */
/*
  1. wajib menyalakan kamera
  2. wajib sharescreen ketika sedang mengerjakan
  3. diperbolehkan untuk melakukan pencarian di internet, kecuali tools AI
  4. tidak diperkenankan berdiskusi, hanya boleh bertanya seputar tugas
  4. waktu pengerjaan hanya 50 menit, dimulai dari kandidat mulai mengerjakan
*/

/* URL Dokumentasi API : https://dummyjson.com/docs/products */
/* URL Desain User Interface : https://cdn.dribbble.com/userupload/10414553/file/original-2d905d116a30699e9bb1bf0e30df9ac2.png?resize=752x3593&vertical=center */

export default function App() {
  const [productData, setProductData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // Jumlah produk per halaman

  const getProductData = async () => {
    try {
      const response = await fetch("https://dummyjson.com/products");
      const data = await response.json();
      setProductData(data.products);
      setFilteredProducts(data.products);

      const uniqueCategories = Array.from(new Set(data.products.map((item) => item.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed to fetch product data:", error);
    }
  };

  const finalPrice = (price, discountPercentage) => {
    const discount = (discountPercentage / 100) * price;
    return price - discount;
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterProducts(query, selectedCategory);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    filterProducts(searchQuery, category);
  };

  const filterProducts = (query, category) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = productData.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(lowerCaseQuery) ||
        product.category.toLowerCase().includes(lowerCaseQuery) ||
        product.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery));

      const matchesCategory = category ? product.category === category : true;

      return matchesSearch && matchesCategory;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset ke halaman pertama setelah filter
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  return (
    <main className="container max-w-screen-lg p-4 mx-auto md:p-8">
      <p className="mb-6 text-3xl font-bold text-center">Product Catalog</p>

      {/* Search and Filter Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 mx-4 mb-6 md:mx-0">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by title, category, or tags..."
          className="flex-grow px-4 py-2 text-lg border rounded-lg shadow focus:outline-none focus:ring focus:ring-green-300"
        />
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryFilter(e.target.value)}
          className="px-4 py-2 text-lg border rounded-lg shadow focus:outline-none focus:ring focus:ring-green-300">
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {paginatedProducts.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between min-h-[100px] m-4 md:m-0 lg:m-0 overflow-hidden transition-all duration-300 border-4 border-transparent shadow-md rounded-xl hover:shadow-lg hover:scale-110 hover:border-green-400 p-4">
            <div className="flex items-center justify-center h-40 mb-4 overflow-hidden bg-gray-200 rounded-xl">
              <img src={item.thumbnail} alt={item.title} className="object-cover w-full h-full" />
            </div>
            {item.title.length > 20 ? item.title.substring(0, 20) + "..." : item.title}
            <p className="flex items-center text-sm font-bold text-yellow-500">
              ★{item.rating.toFixed(1)}
              <span className="ml-1 text-sm font-normal text-gray-500">
                ({item.reviews?.length || 0} reviews)
              </span>
            </p>
            <p className="mt-2 font-bold text-green-600">
              ${finalPrice(item.price, item.discountPercentage).toFixed(2)}{" "}
              <span className="text-sm font-normal text-gray-500 line-through">${item.price}</span>
            </p>
            <button className="py-2 mt-4 font-bold text-center text-white transition-all duration-300 bg-green-500 rounded-lg hover:bg-green-700">
              Add to Cart
            </button>
          </div>
        ))}
      </section>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between gap-4 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-lg font-bold bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50">
          Previous
        </button>
        <p className="text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-lg font-bold bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50">
          Next
        </button>
      </div>

      {/* No Results Message */}
      {filteredProducts.length === 0 && (
        <p className="mt-6 text-lg font-semibold text-center text-gray-600">
          No products match your search or filter.
        </p>
      )}
    </main>
  );
}
