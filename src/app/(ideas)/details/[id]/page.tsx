import DetailsComponent from "@/components/DetailsConponent";

export default async function Details({
  params,
}: {params:Promise<{id : string}>}) {
  const { id } = await params;
  
  return (
    
    <DetailsComponent id={id} />
  );
}
