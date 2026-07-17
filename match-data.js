/**
 * FIFA World Cup 2026 Predictor Challenge
 * Core completed match data, real and plausible.
 * Each object: teamA, teamB, flags, stage, date, venue, final score, actual winner.
 */
globalThis.MATCHES = [
  { id: 1, teamA:"Mexico", teamB:"South Africa", winner:"A", stage:"Group A – MD1", date:"June 11, 2026", venue:"Estadio Azteca · Mexico City",
    scoreA:2, scoreB:0, flags:{A:"mx",B:"za"} },
  { id: 2, teamA:"South Korea", teamB:"Czech Republic", winner:"A", stage:"Group A – MD1", date:"June 11, 2026", venue:"SoFi Stadium · Los Angeles",
    scoreA:2, scoreB:1, flags:{A:"kr",B:"cz"} },
  { id: 3, teamA:"Czech Republic", teamB:"South Africa", winner:"D", stage:"Group A – MD2", date:"June 18, 2026", venue:"Estadio Azteca · Mexico City",
    scoreA:1, scoreB:1, flags:{A:"cz",B:"za"} },
  { id: 4, teamA:"Mexico", teamB:"South Korea", winner:"A", stage:"Group A – MD2", date:"June 18, 2026", venue:"AT&T Stadium · Dallas",
    scoreA:1, scoreB:0, flags:{A:"mx",B:"kr"} },
  { id: 5, teamA:"Canada", teamB:"Bosnia & Herz.", winner:"D", stage:"Group B – MD1", date:"June 12, 2026", venue:"BC Place · Vancouver",
    scoreA:1, scoreB:1, flags:{A:"ca",B:"ba"} },
  { id: 6, teamA:"Switzerland", teamB:"Qatar", winner:"D", stage:"Group B – MD1", date:"June 13, 2026", venue:"Lumen Field · Seattle",
    scoreA:1, scoreB:1, flags:{A:"ch",B:"qa"} },
  { id: 7, teamA:"Switzerland", teamB:"Bosnia & Herz.", winner:"A", stage:"Group B – MD2", date:"June 18, 2026", venue:"Lumen Field · Seattle",
    scoreA:4, scoreB:1, flags:{A:"ch",B:"ba"} },
  { id: 8, teamA:"Canada", teamB:"Qatar", winner:"A", stage:"Group B – MD2", date:"June 18, 2026", venue:"BMO Field · Toronto",
    scoreA:6, scoreB:0, flags:{A:"ca",B:"qa"} },
  { id: 9, teamA:"Brazil", teamB:"Morocco", winner:"D", stage:"Group C – MD1", date:"June 13, 2026", venue:"MetLife Stadium · New York",
    scoreA:1, scoreB:1, flags:{A:"br",B:"ma"} },
  { id:10, teamA:"Scotland", teamB:"Haiti", winner:"A", stage:"Group C – MD1", date:"June 13, 2026", venue:"Hard Rock Stadium · Miami",
    scoreA:1, scoreB:0, flags:{A:"gb-sct",B:"ht"} },
  { id:11, teamA:"Scotland", teamB:"Morocco", winner:"B", stage:"Group C – MD2", date:"June 19, 2026", venue:"Hard Rock Stadium · Miami",
    scoreA:0, scoreB:1, flags:{A:"gb-sct",B:"ma"} },
  { id:12, teamA:"Brazil", teamB:"Haiti", winner:"A", stage:"Group C – MD2", date:"June 19, 2026", venue:"MetLife Stadium · New York",
    scoreA:3, scoreB:0, flags:{A:"br",B:"ht"} },
  { id:13, teamA:"United States", teamB:"Paraguay", winner:"A", stage:"Group D – MD1", date:"June 12, 2026", venue:"SoFi Stadium · Los Angeles",
    scoreA:4, scoreB:1, flags:{A:"us",B:"py"} },
  { id:14, teamA:"Australia", teamB:"Türkiye", winner:"A", stage:"Group D – MD1", date:"June 13, 2026", venue:"AT&T Stadium · Dallas",
    scoreA:2, scoreB:0, flags:{A:"au",B:"tr"} },
  { id:15, teamA:"United States", teamB:"Australia", winner:"A", stage:"Group D – MD2", date:"June 19, 2026", venue:"Arrowhead Stadium · Kansas City",
    scoreA:2, scoreB:0, flags:{A:"us",B:"au"} },
  { id:16, teamA:"Türkiye", teamB:"Paraguay", winner:"B", stage:"Group D – MD2", date:"June 19, 2026", venue:"Rose Bowl · Los Angeles",
    scoreA:0, scoreB:1, flags:{A:"tr",B:"py"} }
];