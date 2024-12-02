import Form from "next/form";
import SearchFormReset from "@/components/SearchFormReset";
import { Search } from "lucide-react";

const SearchForm = ({ query }: { query?: string }) => {
  return (
    <Form
      action="/"
      scroll={false}
      className="relative flex items-center w-full max-w-2xl mx-auto rounded-full border border-gray-200 hover:border-gray-300 transition-colors bg-white shadow-sm"
    >
      <div className="flex items-center flex-1 px-4">
        <Search className="size-5 text-gray-400" />
        <input
          name="query"
          defaultValue={query}
          className="w-full py-3 px-3 outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
          placeholder="Search Startups..."
        />
      </div>

      <div className="flex items-center gap-2 pr-4">
        {query && <SearchFormReset />}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>
    </Form>
  );
};

export default SearchForm;