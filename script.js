
// VARIABLE CADRE
const largeur = window.innerWidth;
const hauteur = window.innerHeight;
const marge = 10; 

//Le fond
const svg = d3
  .select("body")
  .append("svg")
  .attr("class", "tooltip")
  .attr("width", largeur)
  .attr("height", hauteur)
  .style("border", "1px solid black")
  .style("background", "lightblue")

const titre = svg.append("text")
  .attr("x", 10)
  .attr("y", 20)
  .attr("text-anchor", "left")
  .style("font-size", "16spx")
  .style("font-weight", "bold")
  .style("font-family", "sans-serif")
  .text("Post reddit sur le conflit Israelio-palestinien");

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
    });

    //Les Postes ______________________________________________________
  
    // échelle de taille des pays
    const taillePost = d3.scaleLinear()
      .domain([d3.min(data_clean.children, d => d.score),d3.max(data_clean.children, d=> d.score)])
      .range([largeur/100, largeur/20])
      
    //échelle de couleur : 
    const couleurPost = d3.scaleLinear()
      .range(["#6415f7", "#ff75c1"])
      .domain([0.61,0.97]) // pas en dessous de 0,7 je crois

    const couleurCom = d3.scaleLinear()
      .range(["#6415f7", "#ff75c1"])
      .domain([d3.min(data_clean.children.flatMap(post => post.children), d => d.score),d3.max(data_clean.children.flatMap(post => post.children), d => d.score)]) // pas en dessous de 0,7 je crois


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
    const g = svg.append("g");

    let focus = null;

    const noeuds = g
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
      .attr("cx", d => d.x = Math.max(taillePost(d.score) + marge, Math.min(largeur - taillePost(d.score) - marge, d.x)))
      .attr("cy", d => d.y = Math.max(taillePost(d.score) + marge, Math.min(hauteur - taillePost(d.score) - marge, d.y)))
      });

 // Création des commentaires

    function zoom(event, d){
        svg.selectAll(".commentaire").remove();
      const k  = Math.min(largeur, hauteur) / (taillePost(d.score) * 2)
      const tx = largeur/2 - d.x * k
      const ty = hauteur/2 - d.y * k
      g
      .transition()
      .duration(750)
      .attr("transform", `translate(${tx}, ${ty}) scale(${k})`);

      const tailleCom = d3.scaleLinear()
                        .domain([
                          d3.min(data_clean.children.flatMap(post => post.children), com => com.score),
                          d3.max(data_clean.children.flatMap(post => post.children), com => com.score)
                        ])           
                        .range([10, 60]);  

      // MouseOver commentaire
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

      const mousemove = function(event, com) {
        Tooltip
        .html( "commentaire avec "+
          com.score + " upvotes" )
        .style("left", (event.pageX+20) + "px")
        .style("top", (event.pageY-30) + "px")
      }

      var mouseleave = function(event, d) {
        Tooltip
          .style("opacity", 0)
      }

      const c = svg.append("g");

      const commentaires = c
        .selectAll("circle")
        .data(d.children)
        .join(
            (enter) =>
              enter
                .append("circle")
                .attr("class", "commentaire")
                .attr("r", com => tailleCom(com.score))
                .attr("cx", largeur / 2)
                .attr("cy", hauteur / 2)
                .attr("fill", com => couleurCom(com.score))
                .style("fill-opacity", 1)
                .attr("stroke", "black")
                .style("stroke-width", 1)
                .on("mouseover", mouseover) 
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
            );

          const simu2 = d3.forceSimulation(d.children)
          .force("center", d3.forceCenter(largeur / 2).y(hauteur / 2)) 
          .force("charge", d3.forceManyBody().strength(-20)) 
          .force("collide", d3.forceCollide().strength(.1).radius(com => tailleCom(com.score)).iterations(2))
          simu2
          .nodes(d.children)
          .on("tick", function(com){
            commentaires
              .attr("cx", com => com.x)
              .attr("cy", com => com.y)
          });
    }
    
    svg.on("click", () => {
      focus = null;
      g.transition().duration(750)
      .attr("transform", `translate(${0}, ${0}) scale(${1})`)  ;
      d3.selectAll(".commentaire").remove()//.stop();
    })

    console.log(data_clean.children.map(d => ({ score: d.score, ratio: d.ratio })))
})
.catch((error) => {
    throw console.error("erreur",error);
});
