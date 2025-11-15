describe("API smoke", () => {
  it("has env", () => {
    expect(process.env.NEXTAUTH_SECRET).toBeDefined();
  });
});
