import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function PublicMatchesFilters({

  categories,

  category,

  setCategory,

  status,

  setStatus,

  showStatus = true,

}) {

  return (

    <div className={`grid gap-4 mb-8 ${showStatus ? "md:grid-cols-2" : "md:grid-cols-1"}`}>

      <Select
        value={category}
        onValueChange={setCategory}
      >

        <SelectTrigger>

          <SelectValue placeholder="Categoría" />

        </SelectTrigger>

        <SelectContent>

          <SelectItem value="all">

            Todas las categorías

          </SelectItem>

          {

            categories.map(category => (

              <SelectItem
                key={category}
                value={category}
              >

                {category}

              </SelectItem>

            ))

          }

        </SelectContent>

      </Select>

      {

        showStatus && (

          <Select
            value={status}
            onValueChange={setStatus}
          >

            <SelectTrigger>

              <SelectValue placeholder="Estado" />

            </SelectTrigger>

            <SelectContent>

              <SelectItem value="all">

                Todos

              </SelectItem>

              <SelectItem value="pending">

                Pendientes

              </SelectItem>

              <SelectItem value="live">

                En juego

              </SelectItem>

              <SelectItem value="finished">

                Finalizados

              </SelectItem>

            </SelectContent>

          </Select>

        )

      }

    </div>

  );

}