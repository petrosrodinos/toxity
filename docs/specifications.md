# AI-Powered Product Ingredient Intelligence Platform

## Project Overview

Develop a cross-platform application inspired by GreenPoint that enables users to scan and analyze products containing ingredient lists. The platform should support cosmetics, skincare, healthcare products, food, beverages, supplements, household cleaning products, pet products, baby products, and any packaged consumer product that contains ingredients.

The application should function as a continuously expanding global product intelligence platform where users contribute to a shared database by scanning products. Every newly discovered product is analyzed using AI and becomes available to all future users.

Unlike existing ingredient scanning applications, this platform should provide comprehensive AI-generated insights rather than simple safety scores. Every product and ingredient should include detailed descriptions, scientific explanations, benefits, risks, safety information, suitability, alternatives, recommendations, and educational content.

The application should provide the same experience across:

- Android
- Mobile Web
- Desktop Web

---

# Objectives

The platform should allow users to:

- Scan products using barcode or ingredient labels.
- Instantly retrieve existing product information.
- Automatically create new products using AI when they do not exist.
- Analyze every ingredient individually.
- Calculate an overall product quality score.
- Build a global ingredient and product database that improves over time.
- Help consumers make safer purchasing decisions.

---

# Authentication

The application includes complete authentication.

## Registration

- Email
- Password
- Confirm Password

## Login

- Email
- Password

## Forgot Password

## Email Verification

## User Profile

Users can manage:

- Name
- Profile picture
- Country
- Preferred language
- Theme
- Notification settings

---

# Global Data Model

There are two completely different concepts inside the application.

## Global Products

Products belong to the application.

Once a product has been analyzed, every user accesses the exact same product.

Products should never be duplicated simply because multiple users scanned them.

Example:

```
Product

The Ordinary Niacinamide
```

Only one record exists.

---

## User Scan History

Users own references to products they have scanned.

Example:

```
Product

The Ordinary Niacinamide
```

```
UserProductScan

User A → Product
User B → Product
User C → Product
```

The product exists only once.

Each user simply stores their scan history.

---

# Main Navigation

Bottom navigation similar to the provided reference images.

Suggested sections:

- Home
- Scan
- Search
- History
- Profile

---

# Home Screen

The home screen displays:

- Continue Scanning
- Recently Scanned Products
- Trending Products
- Highest Rated Products
- New Products
- Recommended Products
- Categories
- Ingredient Spotlight
- Educational Articles
- Daily Health Tips

---

# Product Scan Flow

Users should be able to scan products in two different ways.

## Method 1 — Barcode Scan

The user opens the camera scanner.

↓

Scans barcode.

↓

The application searches the global product database.

### Product Exists

If found:

- Open Product Details page.
- Create User Scan History record if one does not already exist.
- No AI processing occurs.

### Product Does Not Exist

Launch Product Creation Flow.

---

## Method 2 — Ingredient Label Scan

If barcode scanning fails or no barcode exists:

The application asks the user to capture:

1. Ingredient List
2. Front Product Label

The application extracts:

- Product Name
- Brand
- Ingredients
- Package information
- Marketing claims

AI then creates the complete product.

---

# Product Creation Flow

## Step 1

Capture Ingredient List

The application requests a high-quality image.

OCR extracts:

- Ingredients
- Ingredient order

---

## Step 2

Capture Product Label

The application asks for the front label.

Extract:

- Product Name
- Brand
- Images
- Size
- Claims

Examples:

- Organic
- Vegan
- Gluten Free
- Sugar Free
- Paraben Free
- Cruelty Free

---

## Step 3

AI Product Analysis

The AI receives:

- Product Name
- Brand
- Ingredient List
- Existing Ingredient Database
- Existing Brands
- Existing Categories
- Existing Subcategories

The AI should always attempt to reuse existing:

- Categories
- Subcategories
- Ingredients
- Brands

Only when no suitable match exists should new records be created.

This ensures consistency across the platform.

---

# Category System

Every product belongs to:

Category

↓

Subcategory

Examples

Beauty

- Moisturizers
- Cleansers
- Sunscreens
- Shampoo
- Conditioner
- Hair Oil

Healthcare

- Medicines
- Pain Relief
- First Aid

Food

- Snacks
- Dairy
- Frozen Food
- Drinks

Supplements

- Vitamins
- Minerals
- Protein

Cleaning

- Laundry
- Surface Cleaner
- Dishwashing

Pet Care

- Dog Food
- Cat Food

Baby

- Baby Lotion
- Formula

The hierarchy should remain fully extensible.

---

# AI Product Analysis

The AI generates:

- Overall Product Score
- Product Summary
- Overall Description
- Benefits
- Risks
- Warnings
- Suitability
- Recommended Usage
- Storage Information
- Pregnancy Safety
- Children Safety
- Sensitive Skin Safety
- Allergy Warnings
- Environmental Impact
- Vegan Status
- Cruelty Free Status
- Scientific Confidence
- Frequently Asked Questions
- Alternative Products
- Similar Products

---

# Product Score

Every product receives a score.

Example

```
18.4 / 20
```

Color Scale

Green

Excellent

Light Green

Good

Yellow

Average

Orange

Poor

Red

Very Poor

---

# Product Details Page

The Product Details page should closely follow the layout shown in the provided reference images.

The page contains:

## Hero Section

- Large product image
- Product Name
- Brand
- Overall Score
- Category
- Subcategory

---

## Product Summary

- AI Summary
- Benefits
- Risks
- Warnings

---

## Ingredient List

Large green "INGREDIENTS" section similar to the reference images.

Each ingredient is displayed as an expandable accordion.

Collapsed view contains:

- Colored Safety Indicator
- Ingredient Name
- Expand Button

Expanded view contains:

- Risk Explanation
- Short Summary
- Scientific Description
- Benefits
- Risks
- Purpose in Product
- Common Uses
- Safety Rating
- Environmental Impact
- Pregnancy Safety
- Children Safety
- Allergy Information
- Comedogenic Rating
- Acne Suitability
- Sensitive Skin Suitability
- Natural or Synthetic
- Scientific References
- Confidence Score
- Alternative Ingredients

---

# Ingredient Analysis

Every ingredient should contain:

## General Information

- Name
- Synonyms
- Scientific Name
- Description

## AI Analysis

- Summary
- Full Description
- Benefits
- Risks
- Safety Explanation
- Purpose
- Common Uses

## Health Information

- Pregnancy Safety
- Child Safety
- Allergy Risk
- Carcinogenic Evidence
- Hormone Disruption Risk
- Irritation Risk

## Cosmetic Information

- Acne Rating
- Comedogenic Rating
- Sensitive Skin Suitability

## Sustainability

- Environmental Impact
- Vegan
- Cruelty Free
- Biodegradable

## Scientific Information

- Confidence Score
- Research Summary
- References

---

# Ingredient Scoring

Each ingredient receives:

- Overall Score
- Safety Score
- Risk Score
- Confidence Score

---

# Ingredient Color System

Green

Very Safe

Light Green

Safe

Yellow

Moderate

Orange

Caution

Red

High Risk

Gray

Unknown

---

# Search

Users can search by:

- Barcode
- Product Name
- Brand
- Ingredient
- Category
- Subcategory

Filters:

- Highest Rated
- Lowest Rated
- Newest
- Most Popular

---

# Scan History

Displays products previously scanned by the user.

Each entry displays:

- Product Image
- Product Name
- Brand
- Score
- Scan Date

The history references the shared global product.

---

# Favorites

Users can save:

- Favorite Products
- Favorite Ingredients
- Favorite Brands

---

# Product Database

Every product stores:

- Barcode
- Product Name
- Brand
- Category
- Subcategory
- Description
- AI Summary
- Product Images
- Package Images
- Ingredient Order
- Overall Score
- AI Analysis
- Benefits
- Risks
- Warnings
- Recommendations
- Scientific Confidence
- Verification Status
- Created Date
- Updated Date
- AI Version

---

# Ingredient Database

Every ingredient exists globally only once.

Each ingredient stores:

- Name
- Synonyms
- Scientific Name
- Description
- AI Summary
- Full Scientific Description
- Benefits
- Risks
- Functions
- Safety Score
- Confidence Score
- Color Indicator
- References
- Related Ingredients
- Alternative Ingredients
- Categories

---

# Brand Database

Stores:

- Brand Name
- Logo
- Website
- Country
- Description
- Associated Products

---

# Category Management

Categories and subcategories should be reusable across the entire platform.

During AI product creation:

1. Existing categories are sent to the AI.
2. Existing subcategories are sent to the AI.
3. The AI first attempts to reuse an existing category.
4. If no suitable category exists, a new category is created.
5. The same process applies to subcategories.

This prevents duplicate classifications while allowing the taxonomy to grow naturally.

---

# AI Reanalysis

Products and ingredients should not remain static.

As scientific knowledge evolves, administrators should be able to trigger AI reanalysis to:

- Update scores
- Improve descriptions
- Add new warnings
- Reflect new scientific evidence
- Generate new recommendations

Version history should be maintained for auditing purposes.

---

# Future Community Features

- Product Reviews
- Product Ratings
- Ingredient Discussions
- Report Incorrect Information
- Suggest Product Edits
- Vote on AI Accuracy

---

# Administration

Administrators can:

- Review AI-generated products
- Approve or reject new products
- Merge duplicate products
- Merge duplicate ingredients
- Merge duplicate brands
- Manage categories
- Manage subcategories
- Review reported content
- Trigger AI reanalysis
- Feature products
- Publish educational articles

---

# Complete User Flow

## Existing Product

```
Open App

↓

Scan Barcode

↓

Product Found

↓

Open Product Details

↓

Browse Ingredient Analysis

↓

Product Added to User Scan History
```

---

## New Product

```
Open App

↓

Scan Barcode

↓

Product Not Found

↓

Capture Ingredient List

↓

Capture Product Label

↓

OCR Extraction

↓

AI Product Analysis

↓

Category Matching

↓

Subcategory Matching

↓

Ingredient Analysis

↓

Overall Product Scoring

↓

Create Product

↓

Create or Update Ingredient Records

↓

Save Product to Global Database

↓

Open Product Details

↓

Add Product to User Scan History
```

---

# User Interface & Design

The application's visual design should closely follow the clean, modern style demonstrated in the provided reference images while improving clarity and usability.

## Home & History

- Large rounded product cards.
- Product thumbnail on the left.
- Product name and brand displayed prominently.
- Color-coded overall score badge.
- Scan timestamp.
- Arrow indicating navigation to details.

## Product Details

- Large hero image occupying the top section.
- Product name and brand overlaid on the image.
- Prominent overall score badge.
- Simple segmented control for switching between Product Analysis and AI Chat.
- Large green "INGREDIENTS" section header.
- Accordion-style ingredient cards with expandable AI analysis.
- Consistent color coding for ingredient safety.
- Rounded cards with generous spacing.
- Minimalistic design focused on readability.

## Design Principles

- Mobile-first interface.
- Fast navigation with minimal user interaction.
- Clear hierarchy of information.
- Scientifically trustworthy appearance.
- Consistent typography.
- Large touch targets.
- Responsive layout for desktop, tablet, and mobile devices.
- Emphasis on clarity, education, and informed decision-making.