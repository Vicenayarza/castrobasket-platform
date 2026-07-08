import { useEffect, useState } from "react";

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

import { getCourts } from "@/services/courtService";
import { getReferees } from "@/services/userService";
import { updateMatch } from "@/services/matchService";

export default function EditMatchDialog({
  open,
  onOpenChange,
  match,
  onUpdated,
}) {
  const [courts, setCourts] = useState([]);
  const [referees, setReferees] = useState([]);

  const [courtId, setCourtId] = useState("");
  const [refereeId, setRefereeId] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("pending");

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  useEffect(() => {
    async function load() {
      const [courtsData, refereesData] = await Promise.all([
        getCourts(),
        getReferees(),
      ]);

      setCourts(courtsData);
      setReferees(refereesData);
    }

    if (open) {
      load();
    }
  }, [open]);

  useEffect(() => {
    if (!match) return;

    setCourtId(match.courtId || "");
    setRefereeId(match.refereeId || "");
    setTime(match.time || "");
    setStatus(match.status || "pending");
    setHomeScore(match.homeScore ?? 0);
    setAwayScore(match.awayScore ?? 0);
  }, [match]);

  async function save() {
    if (!courtId || !refereeId || !time || !status) {
      alert("Completa todos los campos.");
      return;
    }

    const court = courts.find((c) => c.id === courtId);
    const referee = referees.find((r) => r.id === refereeId);

    if (!court || !referee) {
      alert("Campo o árbitro no encontrado.");
      return;
    }

    await updateMatch(match.id, {
      courtId,
      courtName: court.name,

      refereeId,
      refereeName: referee.name,

      time,
      status,

      homeScore: Number(homeScore),
      awayScore: Number(awayScore),
    });

    onUpdated();
    onOpenChange(false);
  }

  if (!match) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar partido</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl bg-slate-100 p-4">
            <p className="text-sm text-slate-500">
              {match.category}
              {match.group ? ` · Grupo ${match.group}` : ""}
              {match.phase === "semifinal" ? " · Semifinal" : ""}
              {match.phase === "final" ? " · Final" : ""}
            </p>

            <p className="mt-2 font-bold">
              {match.homeTeamName} vs {match.awayTeamName}
            </p>
          </div>

          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <Select value={courtId} onValueChange={setCourtId}>
            <SelectTrigger>
              <SelectValue placeholder="Campo" />
            </SelectTrigger>

            <SelectContent>
              {courts.map((court) => (
                <SelectItem key={court.id} value={court.id}>
                  {court.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={refereeId} onValueChange={setRefereeId}>
            <SelectTrigger>
              <SelectValue placeholder="Árbitro" />
            </SelectTrigger>

            <SelectContent>
              {referees.map((referee) => (
                <SelectItem key={referee.id} value={referee.id}>
                  {referee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="live">En juego</SelectItem>
              <SelectItem value="finished">Finalizado</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">
                {match.homeTeamName}
              </p>

              <Input
                type="number"
                min="0"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-2">
                {match.awayTeamName}
              </p>

              <Input
                type="number"
                min="0"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button onClick={save}>
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}