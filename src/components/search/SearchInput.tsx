import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchResults } from "../../features/product/productSlice";
import { InputBase, alpha, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Product } from "../../features/product/productTypes";

// Debounce function to delay API calls
function debounce<T>(fn: (arg: T) => void, delay: number) {
  let timeoutId: NodeJS.Timeout | undefined;
  return function (arg: T) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(arg);
    }, delay);
  };
}
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("md")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const SearchInput: React.FC = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce the API call with a delay of 300 milliseconds
  const debouncedSearch = debounce(async (term: string) => {
    try {
      // API call to search products by title
      const response = await fetch(
        `https://api.escuelajs.co/api/v1/products/?title=${term}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const searchResults: Product[] = await response.json();

      // Dispatch the search action with the search results
      dispatch(setSearchResults(searchResults));
    } catch (error) {
      console.error("Error searching products:", error);
    }
  }, 300); // To Adjust the delay here

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    debouncedSearch(searchTerm);
  };

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search products by title"
        inputProps={{ "aria-label": "search" }}
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </Search>
  );
};

export default SearchInput;
