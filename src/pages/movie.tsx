import { FC, useEffect, useState } from "react";
import Btn from "../components/buttons";
import { Plus, PreviousBtn } from "../components/Icon-components";
import RatingComponent from "../components/rating-component";
import FilmHouse from "../assets/images/producer-housing.png";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../utils/store/hooks";
import {
  addToWatchlist,
  deleteFromWatchlist,
  fetchMovieCollection,
  fetchMovieDetails,
  fetchMovieTrailer,
  fetchSpecificDetails,
  showVideoModal,
} from "../utils/store/slides/movie";
import { RootState } from "../utils/store";
import { BASE_IMAGE_URL } from "../utils/services";
import CreditComponent from "../components/credit-component";
import { RotatingLines } from "react-loader-spinner";
import { Crew, MovieData, MovieDetails } from "../utils/store/type";
import ReviewComponent from "../components/review-component";
import SimilarMovieComponent from "../components/similar-movie-component";
import { MdOutlineDeleteOutline } from "react-icons/md";
import ModalVideo from "react-modal-video";
import VideoModal from "../components/videoModal";
// import 'node_modules/react-modal-video/scss/modal-video.scss';



// import { FC, useEffect, useState } from "react";
// ... (rest of your imports)

// Placeholder for a Telegram SVG component. 
// You should define this in a separate file (e.g., TelegramIcon.tsx) or inline it.
// const TelegramIcon = () => (
//     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM17.152 7.217C17.026 6.845 16.591 6.745 16.273 6.953L4.417 14.126C4.08 14.339 4.09 14.819 4.43 15.026L7.203 16.643C7.518 16.829 7.893 16.732 8.11 16.442L9.423 14.733C9.537 14.582 9.771 14.582 9.885 14.733L14.706 20.373C15.025 20.738 15.602 20.738 15.921 20.373L19.57 16.273C19.957 15.83 19.73 15.228 19.23 15.021L5.917 11.758C5.503 11.597 5.518 11.028 5.928 10.87L16.273 6.953C16.591 6.745 17.026 6.845 17.152 7.217Z" fill="white"/>
//     </svg>
// );
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M320 72C183 72 72 183 72 320C72 457 183 568 320 568C457 568 568 457 568 320C568 183 457 72 320 72zM435 240.7C431.3 279.9 415.1 375.1 406.9 419C403.4 437.6 396.6 443.8 390 444.4C375.6 445.7 364.7 434.9 350.7 425.7C328.9 411.4 316.5 402.5 295.4 388.5C270.9 372.4 286.8 363.5 300.7 349C304.4 345.2 367.8 287.5 369 282.3C369.2 281.6 369.3 279.2 367.8 277.9C366.3 276.6 364.2 277.1 362.7 277.4C360.5 277.9 325.6 300.9 258.1 346.5C248.2 353.3 239.2 356.6 231.2 356.4C222.3 356.2 205.3 351.4 192.6 347.3C177.1 342.3 164.7 339.6 165.8 331C166.4 326.5 172.5 322 184.2 317.3C256.5 285.8 304.7 265 328.8 255C397.7 226.4 412 221.4 421.3 221.2C423.4 221.2 427.9 221.7 430.9 224.1C432.9 225.8 434.1 228.2 434.4 230.8C434.9 234 435 237.3 434.8 240.6z"/></svg>


// This is the component used in the movie.tsx file
const TelegramIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
        // Set dimensions for proper scaling
        width="24" 
        height="24"
        // This ensures the icon color matches the text color (white in your button)
        fill="currentColor" 
    >
        {/* The Font Awesome path data you provided */}
        <path d="M320 72C183 72 72 183 72 320C72 457 183 568 320 568C457 568 568 457 568 320C568 183 457 72 320 72zM435 240.7C431.3 279.9 415.1 375.1 406.9 419C403.4 437.6 396.6 443.8 390 444.4C375.6 445.7 364.7 434.9 350.7 425.7C328.9 411.4 316.5 402.5 295.4 388.5C270.9 372.4 286.8 363.5 300.7 349C304.4 345.2 367.8 287.5 369 282.3C369.2 281.6 369.3 279.2 367.8 277.9C366.3 276.6 364.2 277.1 362.7 277.4C360.5 277.9 325.6 300.9 258.1 346.5C248.2 353.3 239.2 356.6 231.2 356.4C222.3 356.2 205.3 351.4 192.6 347.3C177.1 342.3 164.7 339.6 165.8 331C166.4 326.5 172.5 322 184.2 317.3C256.5 285.8 304.7 265 328.8 255C397.7 226.4 412 221.4 421.3 221.2C423.4 221.2 427.9 221.7 430.9 224.1C432.9 225.8 434.1 228.2 434.4 230.8C434.9 234 435 237.3 434.8 240.6z"/>
    </svg>
);





const Movie: FC = () => {
  const { id } = useParams<string>();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    credits,
    reviews,
    details: movieDetails,
    similar,
    collection,
    trailer,
  } = useAppSelector((state: RootState) => state.movie.details);
  const watchlist = useAppSelector((state: RootState) => state.movie.watchlist);
  const { crew, cast } = credits;
  const { results: reviewData } = reviews;
  const { results: similarMoviesData } = similar;
  const { parts, name: collectionName } = collection;
  const collectionId = movieDetails?.belongs_to_collection?.id as string;
  const director = (): Crew[] =>
    crew?.filter((c) => c.job === "Director") as Array<Crew>;
  const writer = (): Crew[] =>
    crew?.filter((c) => c.job === "Writer") as Array<Crew>;

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieDetails({ id: id }));
      dispatch(fetchSpecificDetails({ id: id, infoType: "credits" }));
      dispatch(fetchSpecificDetails({ id: id, infoType: "reviews" }));
      dispatch(fetchSpecificDetails({ id: id, infoType: "similar" }));
    }
  }, [id]);

  useEffect(() => {
    if (collectionId) {
      dispatch(fetchMovieCollection({ collection_id: collectionId }));
    }
  }, [collectionId, id]);

  const watchlistCheck = (): boolean => {
    return !!watchlist.find(
      (movie: MovieData | MovieDetails) => movie.id === movieDetails.id,
    );
  };

  const showModal = () => {
    if (id) {
      dispatch(fetchMovieTrailer({ id: id }));
      dispatch(showVideoModal());
    }
  };




  // PASTE THE CORRECTED FUNCTION HERE
  const formatMovieName = (title: string | undefined): string => {
    if (!title) return "";

    return title
      .toLowerCase()
      // 1. Replace all non-alphanumeric, non-space characters with a hyphen.
      .replace(/[^a-z0-9\s]/g, "-")
      // 2. Replace one or more consecutive spaces or hyphens with a single hyphen.
      .replace(/[\s-]+/g, "-")
      // 3. Remove any leading/trailing hyphens.
      .replace(/^-+|-+$/g, "");
  };
  const formattedMovieName = formatMovieName(movieDetails?.title);
  const telegramLink = `https://telegram.me/Hell_King_69_Bot?start=getfile-${formattedMovieName}`;














  useEffect(() => {
    watchlistCheck();
  }, [watchlist]);

  return (
    <div className="relative w-full min-h-screen flex justify-center items-center">
      {isLoading ? (
        <RotatingLines
          strokeColor="#F8B319"
          strokeWidth="2"
          animationDuration="0.75"
          width="200"
          visible={true}
        />
      ) : (
        <div className="relative w-screen h-full  bg-black flex flex-col justify-start items-start font-lato">
          <div className="absolute flex justify-center items-center z-40 bg-red-500 w-screen">
            <VideoModal />
          </div>
          <div
            className="w-screen"
            style={{
              background: `url(${BASE_IMAGE_URL}${movieDetails.backdrop_path})`,
              backgroundSize: "cover",
            }}
          >
            <div className="w-full h-full flex flex-col justify-start items-start px-4 md:px-[3.12rem] py-10  bg-[linear-gradient(0deg,_rgba(22,_24,_30,_0.70)_0%,_rgba(22,_24,_30,_0.70)_100%)]">
              <div className="flex flex-row space-x-[1.31rem] items-center justify-center">
                <Link to="/">
                  <Btn type="arrow">
                    <PreviousBtn />
                  </Btn>
                </Link>
                <p className="text-primaryText text-[1.75rem] font-extrabold">
                  Back home
                </p>
              </div>
              <div className="flex flex-col-reverse md:flex-row justify-between items-center w-full  lg:h-full mt-4 lg:mt-0 px-2 md:px-[3.13rem]">
                <div className="h-full flex flex-col justify-center items-start space-y-[1.38rem]">
                  <h1 className="text-[2.4rem] lg:text-[4.25rem] text-primaryText font-extrabold lg:max-w-3xl">
                    {movieDetails?.title}
                  </h1>
                  <RatingComponent
                    rating={movieDetails?.vote_average as number}
                    size="double"
                  />
                  <p className="text-[1.56rem] text-primaryText font-bold">
                    {movieDetails?.vote_count} votes
                  </p>
                  <img src={FilmHouse} alt="Producing House" />
                  <p className="text-[1.3rem] md:text-[1.88rem] text-justify lg:text-left font-bold text-primaryText w-full md:w-[54.75rem]">
                    {movieDetails?.overview}
                  </p>
                  <div className="flex flex-col md:flex-row  items-start md:items-center space-y-7 md:space-y-0 md:space-x-[2.85rem] justify-start w-full">
                    {watchlistCheck() ? (
                      <Btn
                        type="cta2"
                        onClick={() =>
                          dispatch(deleteFromWatchlist(movieDetails))
                        }
                      >
                        <div className="flex flex-row items-center space-x-[0.9rem] justify-center ">
                          <MdOutlineDeleteOutline color="white" size="2rem" />
                          <p>Remove from Watchlist</p>
                        </div>
                      </Btn>
                    ) : (
                      <Btn
                        type="cta2"
                        onClick={() => dispatch(addToWatchlist(movieDetails))}
                      >
                        <div className="flex flex-row items-center space-x-[0.9rem] justify-center ">
                          <Plus />
                          <p>Watchlist</p>
                        </div>
                      </Btn>
                    )}
                    <Btn type="cta" onClick={showModal}>
                      <p className="lg:px-[0.65rem]">Watch Trailer</p>
                    </Btn>



                    {/* 🔴 NEW TELEGRAM BUTTON (Changes are here) 🔴 */}
                    <a href={telegramLink} target="_blank" rel="noopener noreferrer">
                      {/* Assuming Btn accepts an 'extraClass' or 'className' prop for custom styling.
                    If your Btn component is a simple Tailwind class wrapper, you would need to adjust 
                    its internal structure to override the default 'cta' style.
                    
                    For this example, I'll pass the custom background color via a class. 
                    If 'cta' sets a background, this custom class must be *stronger* or 
                    applied *after* the base styles.
                */}
                      <Btn
                        type="cta" // Keep 'cta' for default shape/size
                        className="!bg-[#0088CC] hover:!bg-[#007AB8]" // Override background to Telegram Blue
                      >
                        <div className="flex flex-row items-center space-x-[0.9rem] justify-center">
                          <TelegramIcon /> {/* Added SVG icon */}
                          <p className="lg:px-[0.65rem]">Watch Full Movie</p>
                        </div>
                      </Btn>
                    </a>






                  </div>
                </div>
                <div className="h-[31.5rem] lg:h-[45.5rem] w-fit flex-shrink-0 rounded-[1.25rem] overflow-hidden rounded-[1.25rem] relative flex justify-center items-center ">
                  <img
                    src={`${BASE_IMAGE_URL}${movieDetails?.poster_path}`}
                    alt="movie"
                    className="h-full w-full object-contain"
                  />
                  {/*<div className="rounded-bl-[1.25rem] bg-primary h-[2.19rem] w-[10.56rem] absolute top-0 right-0 flex justify-center items-center">*/}
                  {/*  <p className="text-[1.25rem] font-bold">Top rated</p>*/}
                  {/*</div>*/}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start w-full text-primaryText border-y-[0.063rem] border-[rgba(255, 255, 255, 0.1)]">
            <div className="flex flex-col lg:flex-row lg:flex-wrap justify-between lg:justify-start items-start lg:items-center py-[0.94rem] w-full font-bold px-4 md:px-[6.12rem] text-[1rem]">
              <p className="text-primary lg:mr-2">
                Status:{" "}
                <span className="font-normal text-primaryText">
                  {movieDetails?.status}
                </span>
              </p>
              <p className="text-primary lg:mr-2">
                Released Date:{" "}
                <span className="font-normal text-primaryText">
                  {movieDetails?.release_date}
                </span>
              </p>
              <p className="text-primary lg:mr-2">
                Runtime:{" "}
                <span className="font-normal text-primaryText">
                  {movieDetails?.runtime} mins
                </span>
              </p>
              <p className="text-primary lg:mr-2">
                Director:{" "}
                <span className="font-normal text-primaryText">
                  {director()
                    ?.map((d) => d.name)
                    .join(", ")}
                </span>
              </p>
              {writer()?.length !== 0 && (
                <p className="text-primary lg:mr-2">
                  Writer:{" "}
                  <span className="font-normal text-primaryText">
                    {writer()
                      ?.map((d) => d.name)
                      .join(", ")}
                  </span>
                </p>
              )}
              <p className="text-primary lg:mr-2">
                Spoken language:{" "}
                <span className="font-normal text-primaryText">
                  {movieDetails?.spoken_languages
                    ?.map((language) => language.name)
                    .join(", ")}
                </span>
              </p>
              <p className="text-primary lg:mr-2">
                Genres:{" "}
                <span className="font-normal text-primaryText">
                  {movieDetails?.genres?.map((genre) => genre.name).join(", ")}
                </span>
              </p>
              <p className="text-primary lg:mr-2">
                Original title:{" "}
                <span className="font-normal text-primaryText">
                  {movieDetails?.title}
                </span>
              </p>
              <p className="text-primary lg:mr-2">
                Production Companies:{" "}
                <span className="font-normal text-primaryText">
                  {movieDetails?.production_companies
                    ?.map((company) => company.name)
                    .join(", ")}
                </span>
              </p>
              <p className="text-primary lg:mr-2">
                Production Countries:{" "}
                <span className="font-normal text-primaryText">
                  {movieDetails?.production_countries
                    ?.map((country) => country.name)
                    .join(", ")}
                </span>
              </p>
            </div>
          </div>
          {cast && crew && (
            <CreditComponent cast={cast} crew={crew} isLoading={isLoading} />
          )}
          <div className="w-full">
            {parts && collectionName && (
              <SimilarMovieComponent movieData={parts} title={collectionName} />
            )}
          </div>
          {reviewData && reviewData?.length > 0 && (
            <ReviewComponent results={reviewData} />
          )}
          <SimilarMovieComponent
            movieData={similarMoviesData}
            title="Recommendations"
          />
        </div>
      )}
    </div>
  );
};

export default Movie;
