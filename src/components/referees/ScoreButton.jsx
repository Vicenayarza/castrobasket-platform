import { Button } from "@/components/ui/button";

export default function ScoreButton({
  text,
  onClick,
}) {

  return (

    <Button
      className="w-14 h-14 text-2xl font-bold"
      onClick={onClick}
    >

      {text}

    </Button>

  );

}