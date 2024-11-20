import { LitElement, html } from "lit";
import { Task } from "@lit/task";
import { GetContinent } from "./gql/GetContinent";

export class MyElement extends LitElement {
  static properties = {
    continents: { type: Array },
  };

  _continentsTask = new Task(this, {
    task: async ([], { signal }) => {
      const response = await fetch(
        "https://countries.trevorblades.com/graphql",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: GetContinent }),
          signal,
        }
      );

      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    },
    args: () => [],
  });

  render() {
    return this._continentsTask.render({
      pending: () => html`<p>Loading continents...</p>`,
      complete: ({ data: { continents } }) => {
        return html`
          <ul>
            ${continents.map((continent) => {
              return html`<li>${continent.name}</li>`;
            })}
          </ul>
        `;
      },
      error: (e) => html`<p>Error: ${e}</p>`,
    });
  }
}

window.customElements.define("my-element", MyElement);
