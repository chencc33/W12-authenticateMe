import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotList from "./components/Spot/SpotList";
import SpotListByUser from "./components/Spot/SpotListByUser";
import SpotDetail from "./components/Spot/SpotDetail";
import CreateSpotForm from "./components/Spot/CreateSpotForm";
import ReviewListByUser from "./components/Review/ReviewListByUser";
import ReviewListBySpot from "./components/Review/ReviewListBySpot";
import ReviewDetail from "./components/Review/ReviewDetail";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path="/">
            <SpotList />
          </Route>
          <Route exact path='/spots'>
            <SpotList />
          </Route>
          <Route exact path='/spots/current'>
            <SpotListByUser />
          </Route>
          <Route path='/spots/:spotId/reviews'>
            <ReviewListBySpot />
          </Route>
          <Route path='/spots/:spotId'>
            <SpotDetail />
          </Route>
          <Route exact path='/reviews/current'>
            <ReviewListByUser />
          </Route>
          <Route path='/reviews/:reviewId'>
            <ReviewDetail />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
