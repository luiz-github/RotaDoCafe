export const VALE_DO_CAFE_QUERY = `
[out:json][timeout:30];

area["boundary"="administrative"]["admin_level"="4"]["name"="Rio de Janeiro"]->.state;
area["boundary"="administrative"]["admin_level"="8"]["name"~"Vassouras|Valença|Barra do Piraí|Rio das Flores|Piraí|Miguel Pereira|Paty do Alferes|Engenheiro Paulo de Frontin|Volta Redonda"]->.searchArea;

(
  node["tourism"~"attraction|museum|viewpoint"](area.searchArea)(area.state);
  node["historic"~"museum|monument|building"](area.searchArea)(area.state);
);

out;
`;