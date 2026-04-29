function HeaderComponent({ title }) {
  return (
    <div className="container mx-auto my-2">
      <div className="flex justify-center">
        <div className="w-full lg:w-auto">
          <h2 className="m-2 text-center text-4xl font-extrabold text-foreground">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default HeaderComponent;
