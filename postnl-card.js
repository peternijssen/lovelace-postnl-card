const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

const DEFAULT_HIDE = {
  delivered: false,
  first_letter: false,
}

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
      .detail-body,
      .img-body {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
      }
      .info {
        text-align: center;
      }

      .info__icon {
        color: var(--paper-item-icon-color, #44739e);
      }
      .detail-body table {
        padding: 0px 16px;
        width: 100%;
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
      .img-body {
        margin-bottom: 10px;
      }
      .img-body img {
        padding: 5px;
        background: repeating-linear-gradient(
          45deg,
          #B45859,
          #B45859 10px,
          #FFFFFF 10px,
          #FFFFFF 20px,
          #122F94 20px,
          #122F94 30px,
          #FFFFFF 30px,
          #FFFFFF 40px
        );
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

function isToday(dateParameter) {
        var today = new Date();
        return dateParameter.getDate() === today.getDate() && dateParameter.getMonth() === today.getMonth() && dateParameter.getFullYear() === today.getFullYear();
}

class PostNL extends LitElement {
  static get properties() {
    return {
      _hass: Object,
      config: Object,
      delivery: Object,
      distribution: Object,
      letters: Object,
      icon: String,
      name: String,
      _hide: Object,
    }
  }

  constructor() {
    super()

    this._hass = null
    this.delivery = null
    this.distribution = null
    this.letters = null
    this.icon = null
    this._hide = DEFAULT_HIDE
    this._haVersion = null
  }

  set hass(hass) {
    this._hass = hass

    if (this.config.delivery) {
      this.delivery = hass.states[this.config.delivery]
    }

    if (this.config.distribution) {
      this.distribution = hass.states[this.config.distribution]
    }

    if (this.config.letters) {
      this.letters = hass.states[this.config.letters]
    }

    if (this.config.hide) {
      this._hide = { ...this._hide, ...this.config.hide }
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

  render({ _hass, _hide, _values, config, delivery, distribution, letters  } = this) {
    if (!delivery && !distribution && !letters) {
      return html`
        ${renderNotFoundStyles()}
        <ha-card class="not-found">
          Entity not available: <strong class="name">${config.delivery}</strong> or <strong class="name">${config.distribution}</strong> or <strong>${config.letters}</strong>
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
          ${this.renderDeliveryInfo()}
          ${this.renderDistributionInfo()}
        </section>

      ${this.renderLetters()}
      ${this.renderDelivery()}
      ${this.renderDistribution()}
      </ha-card>
    `
  }

  renderLettersInfo() {
    if (!this.letters) return ''

    return html`
      <div class="info">
        <ha-icon class="info__icon" icon="mdi:email"></ha-icon><br />
        <span>${this.letters.state} letters</span>
      </div>
    `
  }

  renderLetters() {
    if (!this.letters || (this.letters && this.letters.state === "0")) return ''

    return html`
      <header>
        <ha-icon class="header__icon" icon="mdi:email"></ha-icon>
        <h2 class="header__title">Letters</h2>
      </header>
      ${this.renderLetterImage()}
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
            ${Object.entries(this.letters.attributes.letters).sort((a, b) => new Date(b[1].delivery_date) - new Date(a[1].delivery_date)).map(([key, letter]) => {
                return this.renderLetter(letter)
            })}
          </tbody>
        </table>
      </section>
    `
  }

  renderLetterImage() {
    if (this._hide.first_letter) return ''

    if (this.letters.attributes.letters[0].image == null) return ''

    return html`
      <section class="img-body">
        <img src="${this.letters.attributes.letters[0].image}&width=400&height=300" />
      </section>
    `
  }

  renderLetter(letter) {
    if (letter.image == null) {
      return html`
        <tr>
          <td class="name">${letter.id}</td>
          <td>${(letter.status_message != null) ? letter.status_message : "Unknown"}</td>
          <td>${(new Date(letter.delivery_date)).toLocaleDateString((navigator.language) ? navigator.language : navigator.userLanguage)}</td>
        </tr>
      `
    } else {
      return html`
        <tr>
          <td class="name"><a href="${letter.image}" target="_blank">${letter.id}</a></td>
          <td>${(letter.status_message != null) ? letter.status_message : "Unknown"}</td>
          <td>${(new Date(letter.delivery_date)).toLocaleDateString((navigator.language) ? navigator.language : navigator.userLanguage)}</td>
        </tr>
      `    
    }
  }

  renderDeliveryInfo() {
    if (!this.delivery) return ''

    return html`
      <div class="info">
        <ha-icon class="info__icon" icon="mdi:truck-delivery"></ha-icon><br />
        <span>${this.delivery.state} enroute</span>
      </div>
      <div class="info">
        <ha-icon class="info__icon" icon="mdi:package-variant"></ha-icon><br />
        <span>${this.delivery.attributes.delivered.length} delivered</span>
      </div>
    `
  }


  renderDistributionInfo() {
    if (!this.distribution) return ''

    return html`
      <div class="info">
        <ha-icon class="info__icon" icon="mdi:truck-delivery"></ha-icon><br />
        <span>${this.distribution.state} enroute</span>
      </div>
      <div class="info">
        <ha-icon class="info__icon" icon="mdi:package-variant"></ha-icon><br />
        <span>${this.distribution.attributes.delivered.length} delivered</span>
      </div>
    `
  }

  renderDelivery() {
    if (!this.delivery) return ''

    // Nothing enroute and delivery disabled
    if (this.delivery.state === "0" && this._hide.delivered) return ''

    return html`
      <header>
        <ha-icon class="header__icon" icon="mdi:package-variant"></ha-icon>
        <h2 class="header__title">Delivery</h2>
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
            ${Object.entries(this.delivery.attributes.enroute).sort((a, b) => new Date(b[1].planned_date) - new Date(a[1].planned_date)).map(([key, shipment]) => {
              return this.renderShipment(shipment)
            })}

            ${this._hide.delivered ? "" : Object.entries(this.delivery.attributes.delivered).sort((a, b) => new Date(b[1].delivery_date) - new Date(a[1].delivery_date)).map(([key, shipment]) => {
              return this.renderShipment(shipment)
            })}
          </tbody>
        </table>
      </section>
    `
  }

  renderDistribution() {
    // Distribution disabled
    if (!this.distribution ) return ''

    // Nothing enroute and delivery disabled
    if (this.distribution.state === "0" && this._hide.delivered) return ''

    return html`
      <header>
        <ha-icon class="header__icon" icon="mdi:package-variant"></ha-icon>
        <h2 class="header__title">Distribution</h2>
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
            ${Object.entries(this.distribution.attributes.enroute).sort((a, b) => new Date(b[1].planned_date) - new Date(a[1].planned_date)).map(([key, shipment]) => {
              return this.renderShipment(shipment)
            })}

            ${this._hide.delivered ? "" : Object.entries(this.distribution.attributes.delivered).sort((a, b) => new Date(b[1].delivery_date) - new Date(a[1].delivery_date)).map(([key, shipment]) => {
              return this.renderShipment(shipment)
            })}
          </tbody>
        </table>
      </section>
    `
  }

  renderShipment(shipment) {
    var delivery_date = "Unknown"

    if (shipment.delivery_date != null) {
      var delivery_date = (new Date(shipment.delivery_date)).toLocaleDateString((navigator.language) ? navigator.language : navigator.userLanguage)
    } else if (shipment.planned_date != null) {
      var delivery_date = 
        (new Date(shipment.planned_date)).toLocaleDateString((navigator.language) ? navigator.language : navigator.userLanguage) + " " +
        (new Date(shipment.planned_from)).toLocaleTimeString((navigator.language) ? navigator.language : navigator.userLanguage) + " - " +
        (new Date(shipment.planned_to)).toLocaleTimeString((navigator.language) ? navigator.language : navigator.userLanguage)
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
    if (!config.delivery && !config.distribution && !config.letters) {
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