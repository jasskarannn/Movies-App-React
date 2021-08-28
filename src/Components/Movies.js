import React, { Component } from 'react'
import { getMovies } from './getMovies';
import axios from 'axios';
export default class Movies extends Component {
    constructor()
    {
        super();
        this.state={ // The only place where you can assign this.state is the constructor.Neither parent nor child components can know if a certain component is stateful or stateless, and they shouldn’t care whether it is defined as a function or a class.
            // This is why state is often called local or encapsulated. It is not accessible to any component other than the one that owns and sets it.
            movies: [],
            currSearchText : '', 
            currPage : 1, // for pagenation
            genres: [{ _id: 'abcd', name: 'All Genres' }],
            cGenre: 'All Genres'
        }
    }
    async componentDidMount(){ // lifecycle method; componentDidMount methods runs after the component output has been rendered to the DOM
        console.log('component did mount');
        let res = await axios.get('https://backend-react-movie.herokuapp.com/movies');
        let genreRes = await axios.get('https://backend-react-movie.herokuapp.com/genres');
        console.log(res.data.movies);
        this.setState({
            movies : res.data.movies,
            genres: [...this.state.genres, ...genreRes.data.genres]
        })
    }
    handleChange = (e) =>{
        let val = e.target.value;
        console.log(val);
        this.setState({ // setState ek function jesme object pass hota hai; also function can be passed
            currSearchText : val
        })
    }
    handlePageChange = (pageNumber) =>{
        this.setState = ({currPage : pageNumber});
    }
    handleGenreChange=(genre)=>{
        this.setState({
            cGenre:genre
        })
    }
    onDelete = (id) =>{
        let arr = this.state.movies.filter(function(movieObj){
            return movieObj._id !== id; // arr will contain filtered array without id/movie to be deleted
        })
        console.log(arr);
        this.setState({
            movies:arr
        });
    }

    sortByRatings = (e) =>{
        let className = e.target.className;
        console.log(className);
        let sortedMovies = [];
        if(className === 'fa fa-sort-asc'){
            //ascending order
            sortedMovies = this.state.movies.sort(function(movieObjA, movieObjB){ // a- b  > 0 ? sort b4 a : a ie ascending order
                return movieObjA.dailyRentalRate - movieObjB.dailyRentalRate;
            });
        }else{
            //descending
            sortedMovies = this.state.movies.sort(function(movieObjA, movieObjB){
                return movieObjB.dailyRentalRate - movieObjA.dailyRentalRate;
            })
        }
        this.setState({
            movies : sortedMovies
        })
    }

    sortByStocks = (e) =>{
        let className = e.target.className;
        console.log(className);
        let sortedMovies2 = [];
        if(className === 'fa fa-sort-asc'){
            sortedMovies2 = this.state.movies.sort(function(movieObjA, movieObjB){
                return movieObjA.numberInStock - movieObjB.numberInStock;
            });
        }else{
            sortedMovies2 = this.state.movies.sort(function(movieObjA, movieObjB){
                return movieObjB.dailyRentalRate - movieObjA.dailyRentalRate;
            });
        }
        this.setState({
            movie : sortedMovies2
        })
        
    }

    

    render() {
        // console.log("render");
        let{movies, currSearchText, currPage, genres, cGenre} = this.state; // ES6 destructuring
        let filteredArr = [];
        let limit = 4;
        if(currSearchText === ''){
            filteredArr = movies; // no changes to filteredArr
        }else{ // actual filtereing that means search bar is not empty
            filteredArr = movies.filter(function(movieObj){
                let title = movieObj.title.toLowerCase();
                console.log(title);
                return title.includes(currSearchText.toLowerCase());
            })
        }
        if(cGenre!='All Genres')
        {
            filteredArr = filteredArr.filter(function(movieObj){
                return movieObj.genre.name==cGenre
            })
        }

        let numberOfPage = Math.ceil(filteredArr.length/limit);
        let pageNumberArr = [];
        for(let i = 0;i < numberOfPage; i++){
            pageNumberArr.push(i+1);
        }
        let si = (currPage - 1) * limit;
        let ei = si + limit; // ei is si + limit + 1; eradicating 1 due to slice upper limit will be not included
        filteredArr = filteredArr.slice(si, ei);
        return (
            //JSX
            <>
        {this.state.movies.length == 0 ? <div className="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div> :
        <div className='container'>
            <div className='row'>
            <div className='col-3'>
            <ul className="list-group">
                    {
                        genres.map((genreObj)=>(
                            <li onClick={()=>this.handleGenreChange(genreObj.name)} key={genreObj._id} className='list-group-item'>
                                {genreObj.name}
                            </li>
                        ))
                    }
                </ul>
                <h5>Current Genre : {cGenre}</h5>
            </div>
            <div className='col-9'>
                <input type = "search" value = {this.state.currSearchText} onChange = {this.handleChange}></input>
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title</th>
                        <th scope="col">Genre</th>
                        <th scope = "col">
                        <i onClick = {this.sortByStocks}  className="fa fa-sort-asc" aria-hidden="true"></i>
                                Stock
                        <i onClick = {this.sortByStocks} className="fa fa-sort-desc" aria-hidden="true"></i>
                        </th>
                        <th scope="col">
                        <i onClick = {this.sortByRatings} className="fa fa-sort-asc"  aria-hidden="true"></i>
                            Rate
                            <i onClick = {this.sortByRatings} className="fa fa-sort-desc" aria-hidden="true"></i></th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    { // JSX code always in {}
                        filteredArr.map((movieObj)=>{
                            return(
                                <tr scope='row' key={movieObj._id} >
                                    <td></td>
                                    <td>{movieObj.title}</td>
                                    <td>{movieObj.genre.name}</td>
                                    <td>{movieObj.numberInStock}</td>
                                    <td>{movieObj.dailyRentalRate}</td>
                                    <td><button type="button" className="btn btn-danger" onClick = {()=> this.onDelete(movieObj._id)}>Delete</button></td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                <nav aria-label = "...">
                    <ul className = "pagination">
                        {
                            pageNumberArr.map((pageNumber)=>{
                                let classStyle = pageNumber === currPage ? 'page-item active' : 'page-item';
                                return (
                                    <li key = {pageNumber} onClick = {()=> this.handlePageChange(pageNumber)} className = {classStyle}><span className = "page-link">{pageNumber}</span></li>
                                )
                            })
                        }
                    </ul>
                </nav>
             </div>
            </div>
         </div>
        }
        </>
     )
    }

}
