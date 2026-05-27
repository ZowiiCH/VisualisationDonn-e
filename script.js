
// VARIABLE CADRE
const largeur = window.innerWidth;
const hauteur = window.innerHeight;
const marge = 20; 

//Le fond
const svg = d3
    .select("body")
    .append("svg")
    .attr("class", "tooltip")
    .attr("width", largeur)
    .attr("height", hauteur)
    .style("border", "1px solid black")
    .style("background", "lightblue")
  
// Importation de mes données
const data = d3.dsv(";", "Data_projet.csv", d => {
  return {
  post_id : d.post_id,
  post_score : +d.post_score,
  post_upvote_ratio : +d.post_upvote_ratio,
  post_title : d.post_title,
  comment_id : d.comment_id,
  score : +d.score // score commentaire
}})
  .then((data) => {
    const data_clean = { "name": "données", "children": []}
    const posts_IDS = [... new Set(data.map(d => d.post_id))];
    posts_IDS.forEach(post => {
      const comments = data.filter(d => d.post_id == post)
      const comments_clean = comments.map(d => {
        return {
          "id": d.comment_id,
          "score": d.score
        }
      })
      const post_data = data.filter(d => d.post_id == post)[0]
      data_clean.children.push({ 
        "id": post, 
        "score": post_data.post_score, 
        "title": post_data.post_title, 
        "ratio": post_data.post_upvote_ratio,
        "children": comments_clean
      })
      data_clean.children.post
    });

  //  // Compute the layout.
  //   const pack = data => d3.pack()
  //       .size([largeur, hauteur])
  //       .padding(3)
  //     (d3.hierarchy(data)
  //       .sum(d => d.value)
  //       .sort((a, b) => b.value - a.value));
  //   const root = pack(data);

    //Les Postes ______________________________________________________
  
    // échelle de taille des pays
    const taillePost = d3.scaleLinear()
      .domain([d3.min(data_clean.children, d => d.score),d3.max(data_clean.children, d=> d.score)])
      .range([largeur/100, largeur/20])
      
    //échelle de couleur : 
    const couleurPost = d3.scaleLinear()
      .range(["#261447", "#fc038c"])
      .domain([0.61,0.97]) // pas en dessous de 0,7 je crois


    // MouseOver
    const Tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "pink")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    const mouseover = function(event, d) {
      Tooltip
      .style("opacity", 1)
      }
    const mousemove = function(event, d) {
      Tooltip
      .html('<u>' + d.title + '</u>' 
        + "<br>" + d.score + " upvotes" 
        + "<br>" + d.ratio + " ration de vote positif")
      .style("left", (event.pageX+20) + "px")
      .style("top", (event.pageY-30) + "px")
    }
    var mouseleave = function(event, d) {
      Tooltip
        .style("opacity", 0)
    }

  // 
    var noeuds = svg.append("g")
      .selectAll("circle")
      .data(data_clean.children)
      .join(
          (enter) =>
            enter
              .append("circle")
              .attr("class", "node")
              .attr("r", d => taillePost(d.score))
              .attr("cx", largeur / 2)
              .attr("cy", hauteur / 2)
              .attr("fill", d => couleurPost(d.ratio))
 //             .transition()
              .style("fill-opacity", 1)
              .attr("stroke", "black")
              .style("stroke-width", 1)
              .on("mouseover", mouseover) 
              .on("mousemove", mousemove)
              .on("mouseleave", mouseleave)
              .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()))
      )

        // Repris de la page et adapté. Collision des cercles
    const simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(largeur / 2).y(hauteur / 2)) 
      .force("charge", d3.forceManyBody().strength(.1)) 
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (taillePost(d.score)+3) }).iterations(1)) 
    simulation
      .nodes(data_clean.children)
      .on("tick", function(d){
        noeuds
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
      });

 // Création des commentaires 


  // // Create the zoom behavior and zoom immediately in to the initial focus node.
  // svg.on("click", (event) => zoom(event, root));
  // let focus = root;
  // let view;
  // zoomTo([focus.x, focus.y, focus.r * 2]);

  // function zoomTo(v) {
  //   const k = largeur / v[2];

  //   view = v;

  //   label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
  //   noeuds.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
  //   noeuds.attr("r", d => d.r * k);
  // }

  // function zoom(event, d) {
  //   const focus0 = focus;

  //   focus = d;

  //   const transition = svg.transition()
  //       .duration(event.altKey ? 7500 : 750)
  //       .tween("zoom", d => {
  //         const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
  //         return t => zoomTo(i(t));
  //       });

  //   label
  //     .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
  //     .transition(transition)
  //       .style("fill-opacity", d => d.parent === focus ? 1 : 0)
  //       .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
  //       .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  // }

  // return svg.noeud();

      console.log(data_clean.children.map(d => ({ score: d.score, ratio: d.ratio })))
  })
  .catch((error) => {
      throw console.error("erreur",error);
  });
