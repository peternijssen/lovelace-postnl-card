const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

function renderNotFoundStyles() {
  return html`
    <style is="custom-style">
      ha-card {
        font-weight: var(--paper-font-body1_-_font-weight);
        line-height: var(--paper-font-body1_-_line-height);
      }
      .not-found {
        flex: 1;
        background-color: red;
        padding: calc(16px);
      }
    </style>
  `
}

function renderStyles() {
  return html`
    <style is="custom-style">
      ha-card {
        -webkit-font-smoothing: var(
          --paper-font-body1_-_-webkit-font-smoothing
        );
        font-size: var(--paper-font-body1_-_font-size);
        font-weight: var(--paper-font-body1_-_font-weight);
        line-height: var(--paper-font-body1_-_line-height);
        padding-bottom: 16px);
      }
      ha-card.no-header {
        padding: 16px 0;
      }
      .info-body,
      .detail-body {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
      }
      .info {
        text-align: center;
      }
      .detail-body table {
        width: 100%;
      }
      .detail-body table {
        padding: 0px 16px;
      }

      .detail-body td {
        padding: 2px;
      }
      .detail-body thead th {
        text-align: left;
      }
      .detail-body tbody tr:nth-child(odd) {
        background-color: var(--paper-card-background-color);
      }
      .detail-body tbody tr:nth-child(even) {
        background-color: var(--secondary-background-color);
      }
      .detail-body tbody td.name a {
        color: var(--primary-text-color);
        text-decoration-line: none;
        font-weight: normal;
      }

      header {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-family: var(--paper-font-headline_-_font-family);
        -webkit-font-smoothing: var(
          --paper-font-headline_-_-webkit-font-smoothing
        );
        font-size: var(--paper-font-headline_-_font-size);
        font-weight: var(--paper-font-headline_-_font-weight);
        letter-spacing: var(--paper-font-headline_-_letter-spacing);
        line-height: var(--paper-font-headline_-_line-height);
        text-rendering: var(
          --paper-font-common-expensive-kerning_-_text-rendering
        );
        opacity: var(--dark-primary-opacity);
        padding: 24px
          16px
          16px;
      }
      .header__icon {
        margin-right: 8px;
        color: var(--paper-item-icon-color, #44739e);
      }
      .header__title {
        font-size: var(--thermostat-font-size-title);
        line-height: var(--thermostat-font-size-title);
        font-weight: normal;
        margin: 0;
        align-self: left;
      }
    </style>
  `
}

class PostNL extends LitElement {
  static get properties() {
    return {
      _hass: Object,
      config: Object,
      packages: Object,
      letters: Object,
      icon: String,
      name: String,
    }
  }

  constructor() {
    super()

    this._hass = null
    this.packageEntity = null
    this.letterEntity = null
    this.icon = null
    this._haVersion = null
  }

  set hass(hass) {
    this._hass = hass

    if (this.config.packages) {
      this.packageEntity = hass.states[this.config.packages]
    }

    if (this.config.letters) {
      this.letterEntity = hass.states[this.config.letters]
    }

    if (typeof this.config.name === 'string') {
      this.name = this.config.name
    } else {
      this.name = "PostNL"
    }

    if (this.config.icon) {
      this.icon = this.config.icon
    } else {
      this.icon = "mdi:mailbox"
    }
  }

  render({ _hass, _hide, _values, config, packageEntity, letterEntity  } = this) {
    if (!packageEntity && !letterEntity) {
      return html`
        ${renderNotFoundStyles()}
        <ha-card class="not-found">
          Entity not available: <strong class="name">${config.packages}</strong> or <strong>${config.letters}</strong>
        </ha-card>
      `
    }

    return html`
      ${renderStyles()}
      <ha-card class="postnl-card">
      <header>
        <ha-icon class="header__icon" .icon=${this.icon}></ha-icon>
        <h2 class="header__title">${this.name}</h2>
      </header>
        <section class="info-body">
          ${this.renderLettersInfo()}
          ${this.renderPackagesInfo()}
        </section>

      ${this.renderLetters()}
      ${this.renderPackages()}
      </ha-card>
    `
  }

  renderLettersInfo() {
    if (!this.letterEntity) return ''

    return html`
      <div class="info">
        <ha-icon icon="mdi:email"></ha-icon><br />
        <span>${this.letterEntity.state} letters</span>
      </div>
    `
  }

  renderPackagesInfo() {
    if (!this.packageEntity) return ''

    return html`
      <div class="info">
        <ha-icon icon="mdi:truck-delivery"></ha-icon><br />
        <span>${this.packageEntity.state} packages today</span>
      </div>
      <div class="info">
        <ha-icon icon="mdi:package-variant"></ha-icon><br />
        <span>${this.packageEntity.state} packages</span>
      </div>
    `
  }

  renderLetters(detail = false) {
    if (!this.letterEntity || (this.letterEntity && this.letterEntity.state === "0")) return ''

    return html`
      <header>
        <ha-icon class="header__icon" icon="mdi:email"></ha-icon>
        <h2 class="header__title">Letters</h2>
      </header>
      <section class="detail-body">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Delivery date</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(this.letterEntity.attributes.letters).map(([key, letter]) => {
              return html`
                  <tr>
                    <td class="name"><a href="${letter.image}" target="_blank">${letter.id}</a></td>
                    <td>${letter.status_message}</td>
                    <td>${(new Date(letter.delivery_date)).toLocaleDateString((navigator.language) ? navigator.language : navigator.userLanguage)}</td>
                  </tr>
              `
            })}
          </tbody>
        </table>
      </section>
    `
  }

  renderPackages() {
    if (!this.packageEntity || (this.packageEntity && this.packageEntity.state === "0")) return ''

    return html`
      <header>
        <ha-icon class="header__icon" icon="mdi:package-variant"></ha-icon>
        <h2 class="header__title">Packages</h2>
      </header>
      <section class="detail-body">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Delivery date</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(this.packageEntity.attributes.shipments).map(([key, shipment]) => {
              return this.renderShipment(shipment)
            })}
          </tbody>
        </table>
      </section>
    `
  }

  renderShipment(shipment) {
    if (shipment.planned_date == null) {
      var delivery_date = (new Date(shipment.delivery_date)).toLocaleDateString((navigator.language) ? navigator.language : navigator.userLanguage)
    } else {
      var delivery_date = 
        (new Date(shipment.planned_date)).toLocaleDateString((navigator.language) ? navigator.language : navigator.userLanguage) + " " +
        (new Date(shipment.planned_to)).toLocaleTimeString((navigator.language) ? navigator.language : navigator.userLanguage) + " - " +
        (new Date(shipment.planned_from)).toLocaleTimeString((navigator.language) ? navigator.language : navigator.userLanguage)
    }

    return html`
        <tr>
          <td class="name"><a href="${shipment.url}" target="_blank">${shipment.name}</a></td>
          <td>${shipment.status_message}</td>
          <td>${delivery_date}</td>
        </tr>
    `
  }

  setConfig(config) {
    if (!config.packages && !config.letters) {
      throw new Error('Please define entities');
    }
    
    this.config = {
      ...config,
    }
  }

  getCardSize() {
    return 3
  }
}

window.customElements.define('postnl-card', PostNL)

export default PostNL
