/**
 * Brain Map Visualization Module
 * Creates interactive force-directed graph using D3.js
 */

import * as d3 from 'd3';

/**
 * Create and render the brain map visualization
 * @param {HTMLElement} container - Container element for the visualization
 * @param {Object} graphData - Graph data with nodes and links
 * @returns {Object} - Visualization instance with control methods
 */
export function createBrainMap(container, graphData) {
  // Clear any existing content
  container.innerHTML = '';
  
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 600;
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto;');
  
  // Create tooltip
  const tooltip = d3.select('#tooltip');
  
  // Create zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([0.2, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });
  
  svg.call(zoom);
  
  // Create a group for the graph content
  const g = svg.append('g');
  
  // Create arrow markers for links
  svg.append('defs').selectAll('marker')
    .data(['link'])
    .join('marker')
    .attr('id', 'arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 25)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('fill', '#64748b')
    .attr('d', 'M0,-5L10,0L0,5');
  
  // Process the graph data
  const nodes = graphData.nodes.map(n => ({ ...n }));
  const links = graphData.links.map(l => ({ ...l }));
  
  // Create force simulation
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(d => (d.value || 20) + 10).iterations(2));
  
  // Draw links
  const link = g.append('g')
    .attr('stroke', '#64748b')
    .attr('stroke-opacity', 0.3)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', d => Math.sqrt(d.value || 1));
  
  // Draw nodes
  const node = g.append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', d => d.value || 20)
    .attr('fill', d => {
      if (d.type === 'center') return '#6366f1';
      if (d.type === 'theme') return d.color || '#8b5cf6';
      return d.color || '#a855f7';
    })
    .attr('cursor', 'pointer')
    .call(drag(simulation));
  
  // Add labels to nodes
  const label = g.append('g')
    .attr('class', 'labels')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .attr('dx', d => (d.value || 20) + 8)
    .attr('dy', '.35em')
    .attr('font-size', d => {
      if (d.type === 'center') return '14px';
      if (d.type === 'theme') return '12px';
      return Math.max(8, Math.min(12, (d.value || 20) / 3)) + 'px';
    })
    .attr('fill', '#e2e8f0')
    .attr('pointer-events', 'none')
    .text(d => d.label);
  
  // Node interactions
  node.on('mouseover', (event, d) => {
    let tooltipContent = `<h4>${d.label}</h4>`;
    
    if (d.type === 'center') {
      tooltipContent += '<p>Central hub representing your mind and interests</p>';
    } else if (d.type === 'theme') {
      tooltipContent += `<p>Theme strength: ${d.score}%</p>`;
    } else if (d.type === 'concept') {
      tooltipContent += `<p>Frequency: ${d.frequency} occurrences</p>`;
      if (d.relatedTheme) {
        tooltipContent += `<p>Related to: ${d.relatedTheme}</p>`;
      }
    }
    
    tooltip
      .html(tooltipContent)
      .style('left', `${event.pageX + 15}px`)
      .style('top', `${event.pageY - 10}px`)
      .classed('visible', true);
    
    // Highlight connected elements
    link.style('stroke', l => {
      if (l.source.id === d.id || l.target.id === d.id) {
        return '#6366f1';
      }
      return '#64748b';
    }).style('stroke-opacity', l => {
      if (l.source.id === d.id || l.target.id === d.id) {
        return 0.8;
      }
      return 0.2;
    });
    
    node.style('opacity', n => {
      const isConnected = links.some(l => 
        (l.source.id === d.id && l.target.id === n.id) ||
        (l.target.id === d.id && l.source.id === n.id)
      );
      if (n.id === d.id || isConnected) {
        return 1;
      }
      return 0.3;
    });
  })
  .on('mousemove', (event, d) => {
    tooltip
      .style('left', `${event.pageX + 15}px`)
      .style('top', `${event.pageY - 10}px`);
  })
  .on('mouseout', () => {
    tooltip.classed('visible', false);
    
    // Reset styles
    link
      .style('stroke', '#64748b')
      .style('stroke-opacity', 0.3);
    
    node.style('opacity', 1);
  });
  
  // Update positions on each tick
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
    
    label
      .attr('x', d => d.x)
      .attr('y', d => d.y);
  });
  
  // Drag behavior
  function drag(simulation) {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }
  
  // Return control methods
  return {
    resetView: () => {
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity.translate(0, 0).scale(1)
      );
    },
    zoomIn: () => {
      svg.transition().duration(300).call(zoom.scaleBy, 1.3);
    },
    zoomOut: () => {
      svg.transition().duration(300).call(zoom.scaleBy, 0.7);
    },
    updateGraph: (newGraphData) => {
      simulation.stop();
      const newNodes = newGraphData.nodes.map(n => ({ ...n }));
      const newLinks = newGraphData.links.map(l => ({ ...l }));
      
      simulation.nodes(newNodes);
      simulation.force('link').links(newLinks);
      simulation.alpha(1).restart();
      
      // Update visualization
      node.data(newNodes).join('circle')
        .attr('r', d => d.value || 20)
        .attr('fill', d => {
          if (d.type === 'center') return '#6366f1';
          if (d.type === 'theme') return d.color || '#8b5cf6';
          return d.color || '#a855f7';
        });
      
      link.data(newLinks).join('line')
        .attr('stroke-width', d => Math.sqrt(d.value || 1));
    },
    simulation
  };
}

/**
 * Export the visualization as PNG
 * @param {HTMLElement} container - Container with the SVG
 * @param {string} filename - Output filename
 */
export function exportAsPNG(container, filename = 'brain-map.png') {
  const svg = container.querySelector('svg');
  if (!svg) {
    console.error('No SVG found in container');
    return;
  }
  
  // Get SVG dimensions
  const bbox = svg.getBBox();
  const width = bbox.width || container.clientWidth;
  const height = bbox.height || container.clientHeight;
  
  // Serialize SVG
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width * 2;
  canvas.height = height * 2;
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Load image
  const img = new Image();
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  img.onload = () => {
    ctx.drawImage(img, 0, 0, width * 2, height * 2);
    URL.revokeObjectURL(url);
    
    // Download
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  
  img.src = url;
}
