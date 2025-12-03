// Custom autocomplete with transparent background and hover effects

class CustomAutocomplete {
    constructor(inputElement) {
        this.input = inputElement;
        this.dropdown = null;
        this.suggestions = [];
        this.selectedIndex = -1;
        this.init();
    }

    init() {
        // Disable browser autocomplete
        this.input.setAttribute('autocomplete', 'off');
        
        // Create dropdown container
        this.createDropdown();
        
        // Load saved names from localStorage
        this.loadSuggestions();
        
        // Event listeners
        this.input.addEventListener('input', () => this.handleInput());
        this.input.addEventListener('focus', () => this.handleInput());
        this.input.addEventListener('blur', () => setTimeout(() => this.hideDropdown(), 200));
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Save name on form submit
        const form = this.input.closest('form');
        if (form) {
            form.addEventListener('submit', () => this.saveName());
        }
    }

    createDropdown() {
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'custom-autocomplete-dropdown';
        this.dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            margin-top: 4px;
            background: rgba(11, 18, 37, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(91, 124, 255, 0.3);
            border-radius: 8px;
            max-height: 200px;
            overflow-y: auto;
            display: none;
            z-index: 1000;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        `;
        
        // Insert dropdown after input wrapper
        const wrapper = this.input.closest('.input-wrapper');
        if (wrapper) {
            wrapper.style.position = 'relative';
            wrapper.appendChild(this.dropdown);
        }
    }

    loadSuggestions() {
        const saved = localStorage.getItem('talky_saved_names');
        if (saved) {
            try {
                this.suggestions = JSON.parse(saved);
            } catch (e) {
                this.suggestions = [];
            }
        }
        
        // Add some default suggestions if empty
        if (this.suggestions.length === 0) {
            this.suggestions = ['SAHIN SULTAN', 'SAHIN'];
        }
    }

    saveName() {
        const name = this.input.value.trim().toUpperCase();
        if (name && name.length >= 2) {
            // Add to suggestions if not already present
            if (!this.suggestions.includes(name)) {
                this.suggestions.unshift(name);
                // Keep only last 10 names
                this.suggestions = this.suggestions.slice(0, 10);
                localStorage.setItem('talky_saved_names', JSON.stringify(this.suggestions));
            }
        }
    }

    handleInput() {
        const value = this.input.value.trim().toUpperCase();
        
        if (value.length < 1) {
            this.hideDropdown();
            return;
        }

        // Filter suggestions - show all that start with the input
        const filtered = this.suggestions.filter(name => 
            name.toUpperCase().startsWith(value) && name.toUpperCase() !== value
        );

        if (filtered.length === 0) {
            this.hideDropdown();
            return;
        }

        this.showDropdown(filtered);
    }

    showDropdown(items) {
        this.dropdown.innerHTML = '';
        this.selectedIndex = -1;

        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            div.textContent = item;
            div.style.cssText = `
                padding: 10px 15px;
                cursor: pointer;
                color: #ffffff;
                font-size: 0.9rem;
                transition: all 0.2s ease;
                border-left: 3px solid transparent;
            `;
            
            // Hover effect
            div.addEventListener('mouseenter', () => {
                this.selectedIndex = index;
                this.updateSelection();
            });
            
            div.addEventListener('mouseleave', () => {
                div.style.background = 'transparent';
                div.style.borderLeftColor = 'transparent';
            });
            
            div.addEventListener('click', () => {
                this.selectItem(item);
            });
            
            this.dropdown.appendChild(div);
        });

        this.dropdown.style.display = 'block';
    }

    hideDropdown() {
        this.dropdown.style.display = 'none';
        this.selectedIndex = -1;
    }

    updateSelection() {
        const items = this.dropdown.querySelectorAll('.autocomplete-item');
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.style.background = 'rgba(91, 124, 255, 0.2)';
                item.style.borderLeftColor = '#5b7cff';
                item.style.transform = 'translateX(4px)';
            } else {
                item.style.background = 'transparent';
                item.style.borderLeftColor = 'transparent';
                item.style.transform = 'translateX(0)';
            }
        });
    }

    handleKeydown(e) {
        const items = this.dropdown.querySelectorAll('.autocomplete-item');
        
        if (items.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                this.updateSelection();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection();
                break;
                
            case 'Enter':
                if (this.selectedIndex >= 0) {
                    e.preventDefault();
                    this.selectItem(items[this.selectedIndex].textContent);
                }
                break;
                
            case 'Escape':
                this.hideDropdown();
                break;
        }
    }

    selectItem(value) {
        this.input.value = value;
        this.hideDropdown();
        
        // Trigger input event for any listeners
        this.input.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Add to signup full name field
    const signUpFullName = document.getElementById('signUpFullName');
    if (signUpFullName) {
        new CustomAutocomplete(signUpFullName);
    }
});
