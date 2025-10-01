/**
 * Cytoscape.js Mock Implementation
 * This is a simplified mock for demonstration purposes when Cytoscape.js CDN is not accessible.
 * In production, use the actual Cytoscape.js library.
 */

if (typeof cytoscape === 'undefined') {
  window.cytoscape = function(options) {
    const container = options.container;
    const elements = options.elements || [];
    const style = options.style || [];
    const layout = options.layout || {};
    
    // Create SVG container
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.backgroundColor = '#ffffff';
    container.appendChild(svg);
    
    // Store node and edge data
    const nodes = [];
    const edges = [];
    const eventHandlers = {};
    
    // Parse elements
    elements.forEach(el => {
      if (el.group === 'nodes') {
        nodes.push(el.data);
      } else if (el.group === 'edges') {
        edges.push(el.data);
      }
    });
    
    // Get style for a selector
    function getStyle(selector, prop) {
      const styleObj = style.find(s => s.selector === selector);
      return styleObj ? styleObj.style[prop] : null;
    }
    
    // Get node-specific style
    function getNodeStyle(node) {
      let nodeStyle = {
        color: '#3498db',
        width: 60,
        height: 60,
        shape: 'circle'
      };
      
      // Apply type-specific styles
      if (node.type === 'Computer') {
        nodeStyle.color = '#e74c3c';
        nodeStyle.width = 80;
        nodeStyle.height = 80;
      } else if (node.type === 'USB Device') {
        nodeStyle.color = '#9b59b6';
        nodeStyle.shape = 'rect';
      } else if (node.type === 'Network Device') {
        nodeStyle.color = '#2ecc71';
        nodeStyle.shape = 'diamond';
      }
      
      return nodeStyle;
    }
    
    // Calculate layout positions (simple circle layout)
    const centerX = container.clientWidth / 2;
    const centerY = container.clientHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.6;
    
    const positions = {};
    nodes.forEach((node, i) => {
      if (node.type === 'Computer') {
        // Put computer in the center
        positions[node.id] = { x: centerX, y: centerY };
      } else {
        // Arrange other nodes in a circle
        const angle = (2 * Math.PI * i) / nodes.length;
        positions[node.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      }
    });
    
    // Draw edges
    edges.forEach(edge => {
      const source = positions[edge.source];
      const target = positions[edge.target];
      
      if (source && target) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute('x1', source.x);
        line.setAttribute('y1', source.y);
        line.setAttribute('x2', target.x);
        line.setAttribute('y2', target.y);
        line.setAttribute('stroke', '#95a5a6');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('marker-end', 'url(#arrowhead)');
        svg.appendChild(line);
      }
    });
    
    // Add arrowhead marker
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '10');
    marker.setAttribute('refX', '8');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute('points', '0 0, 10 3, 0 6');
    polygon.setAttribute('fill', '#95a5a6');
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.insertBefore(defs, svg.firstChild);
    
    // Draw nodes
    nodes.forEach(node => {
      const pos = positions[node.id];
      const nodeStyle = getNodeStyle(node);
      
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute('data-id', node.id);
      g.style.cursor = 'pointer';
      
      let shape;
      if (nodeStyle.shape === 'rect') {
        shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        shape.setAttribute('x', pos.x - nodeStyle.width / 2);
        shape.setAttribute('y', pos.y - nodeStyle.height / 2);
        shape.setAttribute('width', nodeStyle.width);
        shape.setAttribute('height', nodeStyle.height);
        shape.setAttribute('rx', '5');
      } else if (nodeStyle.shape === 'diamond') {
        shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        const points = `${pos.x},${pos.y - nodeStyle.height / 2} ${pos.x + nodeStyle.width / 2},${pos.y} ${pos.x},${pos.y + nodeStyle.height / 2} ${pos.x - nodeStyle.width / 2},${pos.y}`;
        shape.setAttribute('points', points);
      } else {
        shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        shape.setAttribute('cx', pos.x);
        shape.setAttribute('cy', pos.y);
        shape.setAttribute('r', nodeStyle.width / 2);
      }
      
      shape.setAttribute('fill', nodeStyle.color);
      shape.setAttribute('stroke', '#333');
      shape.setAttribute('stroke-width', '2');
      g.appendChild(shape);
      
      // Add label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute('x', pos.x);
      text.setAttribute('y', pos.y + nodeStyle.height / 2 + 20);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#333');
      text.setAttribute('font-size', '12px');
      text.textContent = node.label;
      g.appendChild(text);
      
      // Add click handler
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        // Call handlers for 'tap:node' selector
        if (eventHandlers['tap:node']) {
          eventHandlers['tap:node'].forEach(handler => {
            handler({
              target: {
                data: () => node
              }
            });
          });
        }
      });
      
      svg.appendChild(g);
    });
    
    // API methods
    const api = {
      on: function(event, selector, handler) {
        if (typeof selector === 'function') {
          handler = selector;
          selector = null;
        }
        
        const key = selector ? `${event}:${selector}` : event;
        if (!eventHandlers[key]) {
          eventHandlers[key] = [];
        }
        eventHandlers[key].push(handler);
        
        return this;
      },
      nodes: function() {
        return {
          length: nodes.length
        };
      },
      edges: function() {
        return {
          length: edges.length
        };
      },
      getElementById: function(id) {
        const node = nodes.find(n => n.id === id);
        return {
          data: () => node
        };
      }
    };
    
    // Background click handler
    svg.addEventListener('click', () => {
      if (eventHandlers['tap']) {
        eventHandlers['tap'].forEach(handler => {
          handler({ target: api });
        });
      }
    });
    
    return api;
  };
  
  console.log('Using Cytoscape.js mock implementation for demonstration');
}
