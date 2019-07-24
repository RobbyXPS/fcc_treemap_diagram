//access source data
d3.json("https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json", function (data) {

  //create an array of gaming platforms
  var platforms = [];
  for (var platform in data.children) {
    platforms.push(data.children[platform]["name"]);
  };

  //create the color scale
  var color = d3.scaleOrdinal().
  domain(platforms).
  range(["#ff0000",
  "#ff4000",
  "#ff8000",
  "#ffbf00",
  "#ffff00",
  "#bfff00",
  "#00ff00",
  "#00ff80",
  "#00ffff",
  "#0080ff",
  "#0000ff",
  "#8000ff",
  "#bf00ff",
  "#edc1ff",
  "#ededed",
  "#a8a8a8",
  "#444444",
  "#000000"]);

  //define the body element
  var body = d3.select("body");

  //define the treemap element and it's size and style
  var treemapLayout = d3.treemap().
  size([960, 570]).
  paddingInner(1).
  tile(d3.treemapSquarify.ratio(1));

  //define and draw the tooltip element, hide it with 0 opacity
  var tooltip = body.append("div").
  attr("id", "tooltip").
  style("opacity", 0).
  style('position', 'absolute').
  style('padding', '10px').
  style('border-radius', '10px').
  style('color', '#fffbf9').
  style('background-color', '#333333');

  //create a root node which is needed before you can compute a hierarchical layout
  let root = d3.hierarchy(data);

  //sum traverses the hierarchy tree and sets .value on each node to the sum of its children
  root.sum(function (d) {
    return d.value;
  });

  //pass the hieracrchy object to the treemaplayout so it can be mapped
  var layout = treemapLayout(root);

  //define and draw the group elements to hold treemap squares
  var nodes = d3.select('#cvg_container').
  selectAll('g')
  //leaves are nodes with no children
  .data(root.leaves()).
  enter().
  append('g')
  //x0 is left edge of node, y0 is top edge
  .attr('transform', function (d) {return 'translate(' + [d.x0, d.y0] + ')';});

  //define and draw the treemap game rectangle elements
  nodes.append('rect').
  attr('class', 'tile')
  //x1 is the right edge
  .attr("width", d => d.x1 - d.x0)
  //y1 is the bottom edge
  .attr('height', d => d.y1 - d.y0)
  //populate custom attributes with sourcedata
  .attr("data-name", d => d.data.name).
  attr("data-category", d => d.data.category).
  attr("data-value", d => d.data.value).
  attr("fill", d => color(d.data.category)).
  on("mouseover", function (d) {
    //update opacity so element is visible
    tooltip.style("opacity", .9)
    //place the tooltip based on where mouse is on the page
    .style("left", d3.event.pageX + 20 + "px").
    style("top", d3.event.pageY - 80 + "px").
    style('text-align', 'center')
    //display game info in the tooltip
    .html(
    'Name: ' + d.data.name +
    '<br>Platform: ' + d.data.category +
    '<br>Value: ' + d.data.value).

    attr("data-value", d.data.value).
    attr('transform', 'translate(0,-200)');
  }).
  on("mouseout", function (d) {
    tooltip.style("opacity", 0);
  });

  //add titles to the treemap game nodes squares
  nodes.append("text").
  attr('class', 'tile-text').
  selectAll("tspan").
  data(function (d) {
    //game titles are broken into single words to display by default. This format doesn't display well in smaller nodes so you need to update the format of the strings.
    switch (d.data.name) {
      case "Pac-Man":
        return ["Pac-Man"];
        break;
      case "Mario & Sonic at the Olympic Games":
        return [["Mario &"], ["Sonic at"], ["the"], ["Olympic"]["Games"]];
        break;
      case "Pokemon HeartGold/Pokemon SoulSilver":
        return [["Pokemon"], ["HeartGold"], ["/"], ["Pokemon"], ["SoulSilver"]];
        break;
      case "The Elder Scrolls V: Skyrim":
        return [["The Elder"], ["Scrolls V:"], ["Skyrim"]];
        break;
      case "Pokemon FireRed/Pokemon LeafGreen":
        return [["Pokemon FireRed /"], ["Pokemon LeafGreen"]];
        break;
      case "Super Smash Bros. for Wii U and 3DS":
        return [["Super Smash Bros"], ["for Wii U and 3DS"]];
        break;
      case "FIFA Soccer 13":
        return [["FIFA"], ["Soccer"], ["13"]];
        break;
      case "FIFA 16":
        return [["FIFA"], ["16"]];
        break;
      case "FIFA 17":
        return [["FIFA"], ["17"]];
        break;
      case "Star Wars Battlefront (2015)":
        return [["Star"], ["Wars"], ["Battle-"], ["front"], ["(2015)"]];
        break;
      case "Call of Duty: Advanced Warfare":
        return [["Call of"], ["Duty:"], ["Advan-"], ["ced"], ["Warfare"]];
        break;
      case "Super Mario 3D Land":
        return [["Super"], ["Mario"], ["3D"], ["Land"]];
        break;
      case "The Legend of Zelda: Ocarina of Time":
        return [["The"], ["Legend"], ["of"], ["Zelda:"], ["Ocarina"], ["of Time"]];
        break;
      case "Crash Bandicoot 2: Cortex Strikes Back":
        return [["Crash"], ["Bandi-"], ["coot"], ["2:"], ["Cortex"], ["Strikes"]];
        break;
      //split game titles when it encounters non-alph characters
      default:
        return d.data.name.split(/(?=[A-Z][^A-Z])/g);}
  }).
  enter().append("tspan").
  attr("x", 4).
  attr("y", function (d, i) {return 8 + i * 10;}).
  text(d => d);

  //define and draw legend and it's header
  d3.select('#legend').
  selectAll('g').
  data(platforms).
  enter().
  append('text').
  attr('x', 420).
  attr('y', 40).
  style('font-size', '15px').
  text('Gaming Platforms');

  //define and draw the square elements for legend key
  d3.select('#legend').
  selectAll('g').
  data(platforms).
  enter().
  append('rect').
  attr('class', 'legend-item').
  attr('transform', 'translate(190,80)').
  attr('width', 30).
  attr('height', 30)
  //split the squares into three columns and adjust their x/y
  .attr('x', function (d, i) {
    if (i <= 5) {return 30;};
    if (i > 5 && i <= 11) {return 260;};
    if (i > 11 && i <= 17) {return 490;};
  }).
  attr('y', function (d, i) {
    if (i == 0 || i == 6 || i == 12) {return 0;};
    if (i == 1 || i == 7 || i == 13) {return 30;};
    if (i == 2 || i == 8 || i == 14) {return 60;};
    if (i == 3 || i == 9 || i == 15) {return 90;};
    if (i == 4 || i == 10 || i == 16) {return 120;};
    if (i == 5 || i == 11 || i == 17) {return 150;};
  }).
  attr("fill", function (d, i) {
    return color(platforms[i]);
  });

  //define and draw the platform title elements for legend key
  d3.select('#legend').
  selectAll('g').
  data(platforms).
  enter().
  append('text').
  attr('class', 'platform-titles').
  text(function (d, i) {return platforms[i];}).
  attr('transform', 'translate(200,80)').
  style('font-size', '15px')
  //split the titles into three columns and adjust their x/y
  .attr('x', function (d, i) {
    if (i <= 5) {return 70;};
    if (i > 5 && i <= 11) {return 300;};
    if (i > 11 && i <= 17) {return 530;};
  }).
  attr('y', function (d, i) {
    if (i == 0 || i == 6 || i == 12) {return 20;};
    if (i == 1 || i == 7 || i == 13) {return 50;};
    if (i == 2 || i == 8 || i == 14) {return 80;};
    if (i == 3 || i == 9 || i == 15) {return 110;};
    if (i == 4 || i == 10 || i == 16) {return 142;};
    if (i == 5 || i == 11 || i == 17) {return 172;};
  });
});