import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { getCategories } from "@/services/categoryService";
import { getCourts } from "@/services/courtService";
import { getReferees } from "@/services/userService";

import {
  generateQuarterfinals,
  generateSemifinals,
  generateSemifinalsFromQuarterfinals,
  generateFinal,
} from "@/services/playoffService";

export default function PlayoffsDialog({ onGenerated }) {
  const [open, setOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [courts, setCourts] = useState([]);
  const [referees, setReferees] = useState([]);

  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const [quarters, setQuarters] = useState([
    { time: "", courtId: "", refereeId: "" },
    { time: "", courtId: "", refereeId: "" },
    { time: "", courtId: "", refereeId: "" },
    { time: "", courtId: "", refereeId: "" },
  ]);

  const [semis, setSemis] = useState([
    { time: "", courtId: "", refereeId: "" },
    { time: "", courtId: "", refereeId: "" },
  ]);

  const [finalData, setFinalData] = useState({
    time: "",
    courtId: "",
    refereeId: "",
  });

  useEffect(() => {
    if (!open) return;

    async function load() {
      const [categoriesData, courtsData, refereesData] = await Promise.all([
        getCategories(),
        getCourts(),
        getReferees(),
      ]);

      setCategories(categoriesData);
      setCourts(courtsData);
      setReferees(refereesData);
    }

    load();
  }, [open]);

  function getCourt(id) {
    return courts.find((court) => court.id === id);
  }

  function getReferee(id) {
    return referees.find((referee) => referee.id === id);
  }

  function buildData(item) {
    const court = getCourt(item.courtId);
    const referee = getReferee(item.refereeId);

    if (!court || !referee || !item.time) {
      throw new Error("Completa hora, campo y árbitro.");
    }

    return {
      time: item.time,
      courtId: court.id,
      courtName: court.name,
      refereeId: referee.id,
      refereeName: referee.name,
    };
  }

  function updateQuarter(index, field, value) {
    const copy = [...quarters];
    copy[index] = {
      ...copy[index],
      [field]: value,
    };
    setQuarters(copy);
  }

  function updateSemi(index, field, value) {
    const copy = [...semis];
    copy[index] = {
      ...copy[index],
      [field]: value,
    };
    setSemis(copy);
  }

  async function handleGenerateQuarters() {
    if (!category) {
      alert("Selecciona una categoría.");
      return;
    }

    setLoading(true);

    try {
      await generateQuarterfinals({
        category,
        quarter1: buildData(quarters[0]),
        quarter2: buildData(quarters[1]),
        quarter3: buildData(quarters[2]),
        quarter4: buildData(quarters[3]),
      });

      alert("Cuartos generados correctamente.");
      onGenerated?.();
    } catch (error) {
      alert(error.message || "Error al generar cuartos.");
    }

    setLoading(false);
  }

  async function handleGenerateNormalSemis() {
    if (!category) {
      alert("Selecciona una categoría.");
      return;
    }

    setLoading(true);

    try {
      await generateSemifinals({
        category,
        semi1: buildData(semis[0]),
        semi2: buildData(semis[1]),
      });

      alert("Semifinales generadas correctamente.");
      onGenerated?.();
    } catch (error) {
      alert(error.message || "Error al generar semifinales.");
    }

    setLoading(false);
  }

  async function handleGenerateSemisFromQuarters() {
    if (!category) {
      alert("Selecciona una categoría.");
      return;
    }

    setLoading(true);

    try {
      await generateSemifinalsFromQuarterfinals({
        category,
        semi1: buildData(semis[0]),
        semi2: buildData(semis[1]),
      });

      alert("Semifinales desde cuartos generadas correctamente.");
      onGenerated?.();
    } catch (error) {
      alert(error.message || "Error al generar semifinales.");
    }

    setLoading(false);
  }

  async function handleGenerateFinal() {
    if (!category) {
      alert("Selecciona una categoría.");
      return;
    }

    setLoading(true);

    try {
      await generateFinal({
        category,
        finalData: buildData(finalData),
      });

      alert("Final generada correctamente.");
      onGenerated?.();
    } catch (error) {
      alert(error.message || "Error al generar final.");
    }

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Generar playoffs
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Generar playoffs
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          <div>
            <p className="font-semibold mb-2">Categoría</p>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona categoría" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <section className="rounded-2xl border p-5 space-y-4">
            <h3 className="text-xl font-bold">
              Cuartos de final
            </h3>

            <p className="text-sm text-slate-500">
              Para Senior: 1ºA vs 2ºB, 1ºB vs 2ºA, 1ºC vs 2ºD, 1ºD vs 2ºC.
            </p>

            {quarters.map((quarter, index) => (
              <PlayoffRow
                key={index}
                title={`Cuarto ${index + 1}`}
                data={quarter}
                courts={courts}
                referees={referees}
                onChange={(field, value) => updateQuarter(index, field, value)}
              />
            ))}

            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
              onClick={handleGenerateQuarters}
            >
              Generar cuartos
            </Button>
          </section>

          <section className="rounded-2xl border p-5 space-y-4">
            <h3 className="text-xl font-bold">
              Semifinales
            </h3>

            <p className="text-sm text-slate-500">
              Para grupo único o dos grupos: genera semifinales directamente. Para Senior, genera semifinales desde cuartos finalizados.
            </p>

            {semis.map((semi, index) => (
              <PlayoffRow
                key={index}
                title={`Semifinal ${index + 1}`}
                data={semi}
                courts={courts}
                referees={referees}
                onChange={(field, value) => updateSemi(index, field, value)}
              />
            ))}

            <div className="grid md:grid-cols-2 gap-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
                onClick={handleGenerateNormalSemis}
              >
                Generar semifinales normales
              </Button>

              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={loading}
                onClick={handleGenerateSemisFromQuarters}
              >
                Generar semis desde cuartos
              </Button>
            </div>
          </section>

          <section className="rounded-2xl border p-5 space-y-4">
            <h3 className="text-xl font-bold">
              Final
            </h3>

            <PlayoffRow
              title="Final"
              data={finalData}
              courts={courts}
              referees={referees}
              onChange={(field, value) =>
                setFinalData((current) => ({
                  ...current,
                  [field]: value,
                }))
              }
            />

            <Button
              className="w-full bg-black hover:bg-slate-800"
              disabled={loading}
              onClick={handleGenerateFinal}
            >
              Generar final
            </Button>
          </section>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PlayoffRow({
  title,
  data,
  courts,
  referees,
  onChange,
}) {
  return (
    <div className="grid md:grid-cols-4 gap-3 items-center">
      <div className="font-semibold">
        {title}
      </div>

      <Input
        type="time"
        value={data.time}
        onChange={(e) => onChange("time", e.target.value)}
      />

      <Select
        value={data.courtId}
        onValueChange={(value) => onChange("courtId", value)}
      >
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

      <Select
        value={data.refereeId}
        onValueChange={(value) => onChange("refereeId", value)}
      >
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
    </div>
  );
}