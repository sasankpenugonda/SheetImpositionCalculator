# Sticker Sheet Imposition Calculator

A professional, zero-dependency, client-side web application designed to help sticker businesses, artists, and print shops optimize their printing layouts and reduce waste. 

This tool calculates the most efficient way to pack custom-sized stickers onto physical print sheets (like 13x19, Letter, or SRA3) while rigorously respecting print constraints like bleed, cutting gaps, sheet margins, and gripper edges.

## Documentation Directory

For deep dives into the application, please refer to the following documents:
- **[PRODUCT.md](./PRODUCT.md)**: Details the core features, user workflows, target audience, and future roadmap. Start here if you are a Product Manager or UX Designer.
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Details the technical stack, state management, mathematical packing engine, and canvas rendering logic. Start here if you are an AI Agent, Developer, or Engineer looking to modify the codebase.

## Quick Start

1. Open `index.html` in any modern web browser. (No build step, server, or bundler required).
2. Use the **Sheet & Cover Size** inputs to define your boundaries.
3. Configure **Print Constraints** (Bleed, Gap, Margin, Gripper Edge).
4. Review the generated **Suggested Sizes** in the sidebar and select the most efficient layout.
5. Upload an image to preview the final cut lines and export a high-res PDF dieline.
