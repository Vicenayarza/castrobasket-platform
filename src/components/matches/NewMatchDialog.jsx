import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getTeams } from "@/services/teamService";
import { getCourts } from "@/services/courtService";
import { getReferees } from "@/services/userService";
import { getCategories } from "@/services/categoryService";
import { createMatch } from "@/services/matchService";

export default function NewMatchDialog({
  open,
  onOpenChange,
  onCreated,
}) {

  const [teams, setTeams] = useState([]);
  const [courts, setCourts] = useState([]);
  const [referees, setReferees] = useState([]);
  const [categories, setCategories] = useState([]);

  const [category, setCategory] = useState("");
  const [group, setGroup] = useState("");
  const [phase, setPhase] = useState("groups");

  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");

  const [courtId, setCourtId] = useState("");
  const [refereeId, setRefereeId] = useState("");

  const [time, setTime] = useState("");

  useEffect(() => {

    async function load() {

      const [

        teamsData,
        courtsData,
        refereesData,
        categoriesData,

      ] = await Promise.all([

        getTeams(),

        getCourts(),

        getReferees(),

        getCategories(),

      ]);

      setTeams(teamsData);
      setCourts(courtsData);
      setReferees(refereesData);
      setCategories(categoriesData);

    }

    if (open) {

      load();

    }

  }, [open]);

  const selectedCategory = useMemo(() => {

    return categories.find(

      (c) => c.name === category

    );

  }, [category, categories]);

  const availableGroups = selectedCategory?.groups || [];

  useEffect(() => {

    if (availableGroups.length === 1) {

      setGroup(availableGroups[0]);

      return;

    }

    setGroup("");

  }, [category]);

  const filteredTeams = useMemo(() => {

    return teams.filter((team) => {

      if (team.category !== category) {

        return false;

      }

      if (phase === "groups") {

        return team.group === group;

      }

      return true;

    });

  }, [

    teams,
    category,
    group,
    phase,

  ]);
    async function save() {

    if (
      !category ||
      !homeTeamId ||
      !awayTeamId ||
      !courtId ||
      !refereeId ||
      !time
    ) {

      alert("Completa todos los campos.");

      return;

    }

    if (phase === "groups" && !group) {

      alert("Selecciona un grupo.");

      return;

    }

    if (homeTeamId === awayTeamId) {

      alert("Los equipos deben ser distintos.");

      return;

    }

    const home = teams.find(
      (t) => t.id === homeTeamId
    );

    const away = teams.find(
      (t) => t.id === awayTeamId
    );

    const court = courts.find(
      (c) => c.id === courtId
    );

    const referee = referees.find(
      (r) => r.id === refereeId
    );

    await createMatch({

      category,

      group: phase === "groups" ? group : "",

      phase,

      homeTeamId: home.id,
      homeTeamName: home.name,

      awayTeamId: away.id,
      awayTeamName: away.name,

      courtId: court.id,
      courtName: court.name,

      refereeId: referee.id,
      refereeName: referee.name,

      time,

    });

    setCategory("");
    setGroup("");
    setPhase("groups");

    setHomeTeamId("");
    setAwayTeamId("");

    setCourtId("");
    setRefereeId("");

    setTime("");

    onCreated();

    onOpenChange(false);

  }

  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent className="sm:max-w-lg">

        <DialogHeader>

          <DialogTitle>

            Nuevo partido

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          <Select
            value={category}
            onValueChange={(value) => {

              setCategory(value);

              setHomeTeamId("");
              setAwayTeamId("");

            }}
          >

            <SelectTrigger>

              <SelectValue placeholder="Categoría"/>

            </SelectTrigger>

            <SelectContent>

              {

                categories.map((category)=>(

                  <SelectItem
                    key={category.id}
                    value={category.name}
                  >

                    {category.name}

                  </SelectItem>

                ))

              }

            </SelectContent>

          </Select>

          <Select
            value={phase}
            onValueChange={(value)=>{

              setPhase(value);

              setHomeTeamId("");
              setAwayTeamId("");

            }}
          >

            <SelectTrigger>

              <SelectValue/>

            </SelectTrigger>

            <SelectContent>

              <SelectItem value="groups">

                Fase de grupos

              </SelectItem>

              <SelectItem value="semifinal">

                Semifinal

              </SelectItem>

              <SelectItem value="final">

                Final

              </SelectItem>

            </SelectContent>

          </Select>

          {

            phase === "groups" &&
            category && (

              <Select
                value={group}
                onValueChange={(value)=>{

                  setGroup(value);

                  setHomeTeamId("");
                  setAwayTeamId("");

                }}
              >

                <SelectTrigger>

                  <SelectValue placeholder="Grupo"/>

                </SelectTrigger>

                <SelectContent>

                  {

                    availableGroups.map((group)=>(

                      <SelectItem
                        key={group}
                        value={group}
                      >

                        Grupo {group}

                      </SelectItem>

                    ))

                  }

                </SelectContent>

              </Select>

            )

          }
            <Select
            value={homeTeamId}
            onValueChange={(value) => {

              setHomeTeamId(value);

              if (awayTeamId === value) {
                setAwayTeamId("");
              }

            }}
          >

            <SelectTrigger>

              <SelectValue placeholder="Equipo local" />

            </SelectTrigger>

            <SelectContent>

              {

                filteredTeams.map((team) => (

                  <SelectItem
                    key={team.id}
                    value={team.id}
                  >

                    {team.name}

                  </SelectItem>

                ))

              }

            </SelectContent>

          </Select>

          <Select
            value={awayTeamId}
            onValueChange={setAwayTeamId}
          >

            <SelectTrigger>

              <SelectValue placeholder="Equipo visitante" />

            </SelectTrigger>

            <SelectContent>

              {

                filteredTeams
                  .filter((team) => team.id !== homeTeamId)
                  .map((team) => (

                    <SelectItem
                      key={team.id}
                      value={team.id}
                    >

                      {team.name}

                    </SelectItem>

                  ))

              }

            </SelectContent>

          </Select>

          <Select
            value={courtId}
            onValueChange={setCourtId}
          >

            <SelectTrigger>

              <SelectValue placeholder="Campo" />

            </SelectTrigger>

            <SelectContent>

              {

                courts.map((court) => (

                  <SelectItem
                    key={court.id}
                    value={court.id}
                  >

                    {court.name}

                  </SelectItem>

                ))

              }

            </SelectContent>

          </Select>

          <Select
            value={refereeId}
            onValueChange={setRefereeId}
          >

            <SelectTrigger>

              <SelectValue placeholder="Árbitro" />

            </SelectTrigger>

            <SelectContent>

              {

                referees.map((referee) => (

                  <SelectItem
                    key={referee.id}
                    value={referee.id}
                  >

                    {referee.name}

                  </SelectItem>

                ))

              }

            </SelectContent>

          </Select>

          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >

            Cancelar

          </Button>

          <Button
            onClick={save}
          >

            Crear partido

          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  );

}