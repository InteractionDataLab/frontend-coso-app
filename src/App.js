import React, { useState, useEffect, useContext } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { Container } from 'semantic-ui-react';

import Home from "./pages/Home";
import About from "./pages/About";
import { Login, Logout } from "./pages/Login";
import CreateProgram from "./pages/CreateProgram";
import Program from './pages/Program';
import Invitation from './pages/Invitation';
import Team from './pages/Team';
import TakeSurvey from './pages/TakeSurvey';
import Participant from "./pages/Participant";
import Dataviz from './pages/Dataviz';
import Surveys from './pages/Surveys';
import ResponsiveContainer from "./components/ResponsiveContainer";
import Header from "./components/Header";
import { Context, cleanContext, isParticipant, isModerator } from './utils/Context';
import { Api, AxiosInterceptors } from './Api';

function App() {
  const context = useContext(Context);
  const [user, setUser] = useState({});
  const [firstLoad, setFirstLoad] = useState(true);
  const [programs, setPrograms] = useState({});
  const [currentProgram, setCurrentProgram] = useState("");
  const [currentParticipant, setCurrentParticipant] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if(!firstLoad) {
      localStorage.setItem("CurrentProgram", currentProgram);
    }
  }, [currentProgram])

  const loadPrograms = async(context) => {
    await Api.get('programs')
    .then((res) => {
      res.data.sort((p1, p2) => p1.name.toLowerCase() > p2.name.toLowerCase() ? 1 : -1);
      const listPrograms = res.data.filter((p, i) => {
        if(isParticipant(context, p.id) || isModerator(context, p.id)) {
          return true;
        }
      })

      let newPrograms = {};
      listPrograms.map((p, i) => {
        newPrograms[p.name.replaceAll(" ", "_")] = { "id": p.id, "name": p.name, "description": p.description, "year": p.year };
      })

      setPrograms(newPrograms);
      localStorage.setItem("Programs", JSON.stringify(newPrograms));
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    if(firstLoad) {
      const getUser = async() => {
        await Api.get('users/self')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("User", JSON.stringify(res.data));
        })
        .catch((error) => {
          cleanContext();
        });
      }

      if(localStorage.getItem("Authorization")) {
        getUser();

        const programs_data = JSON.parse(localStorage.getItem("Programs"));
        if(programs_data) {
          setPrograms(programs_data);
        } else {
          setPrograms({});
        }

        const current_program = localStorage.getItem("CurrentProgram");
        if(current_program) {
          setCurrentProgram(current_program);
        } else {
          setCurrentProgram("");
        }

        const current_participant = JSON.parse(localStorage.getItem("CurrentParticipant"));
        if(current_participant) {
          setCurrentParticipant(current_participant);
        } else {
          setCurrentParticipant({});
        }
      }

      setFirstLoad(false);
    }
  }, [firstLoad]);

  return (
    <Context.Provider value={{firstLoad, user, setUser, programs, setPrograms, loadPrograms, currentProgram, setCurrentProgram, currentParticipant, setCurrentParticipant, isMobile, setIsMobile}}>
      <BrowserRouter>
        <AxiosInterceptors>
          <ResponsiveContainer>
            <Routes>
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/program/:program" element={<Program />} />
              <Route path="/program/create" element={<CreateProgram />} />
              <Route path="/program/:program/surveys" element={<Surveys />} />
              <Route path="/survey" element={<TakeSurvey />} />
              <Route path="/program/:program/dataviz" element={<Dataviz />} />
              <Route path="/program/:program/team/:team_id" element={<Team />} />
              <Route path="/program/:program/team/:team_id/participant/:participant_id" element={<Participant />} />
              <Route path="/" element=
                {<>
                  { user.email ? null : <Header /> }
                  <Home />
                </>} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/invite" element={<Invitation />} />
            </Routes>
          </ResponsiveContainer>
        </AxiosInterceptors>
      </BrowserRouter>
    </Context.Provider>
  )
}

export default App;
