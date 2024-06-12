import { useEffect, useState } from 'react';
import Header from './../components/header/header';
import {Search, FindCards} from '../components/search/search';
import Card from './../components/card/card';
import axios from 'axios';
import { UrlServer } from "../App"



function SearchPage() {
  return (
    <div>
      <Header />
      <Search />
    </div>
  );
}

export default SearchPage;
